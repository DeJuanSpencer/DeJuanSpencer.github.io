// Small HTML tokenizer for the machine checks. No network, no dependencies.
// Tracks open tags against the void-element list, handles comments, script, style and quoted attributes,
// and reports unclosed or mismatched tags with line numbers.

export const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style']);
const INLINE = new Set(['a', 'abbr', 'b', 'cite', 'code', 'em', 'i', 'mark', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u']);

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', middot: '·',
  hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', times: '×', copy: '©',
};

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function parseAttrs(raw) {
  const attrs = {};
  const re = /([^\s=\/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(raw))) attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return attrs;
}

// Token types: open, close, text, rawtext, comment, doctype, error.
export function tokenize(html) {
  const tokens = [];
  const n = html.length;
  let i = 0;
  let line = 1;
  const advance = (to) => {
    for (; i < to; i++) if (html.charCodeAt(i) === 10) line++;
  };
  const push = (t) => tokens.push(t);

  while (i < n) {
    const startLine = line;
    if (html[i] !== '<') {
      let j = html.indexOf('<', i);
      if (j < 0) j = n;
      push({ type: 'text', text: html.slice(i, j), line: startLine });
      advance(j);
      continue;
    }
    if (html.startsWith('<!--', i)) {
      const j = html.indexOf('-->', i + 4);
      if (j < 0) {
        push({ type: 'error', message: 'unterminated comment', line: startLine });
        advance(n);
      } else {
        push({ type: 'comment', text: html.slice(i + 4, j), line: startLine });
        advance(j + 3);
      }
      continue;
    }
    if (html.startsWith('<!', i)) {
      const j = html.indexOf('>', i);
      if (j < 0) {
        push({ type: 'error', message: 'unterminated declaration', line: startLine });
        advance(n);
      } else {
        push({ type: 'doctype', text: html.slice(i + 2, j), line: startLine });
        advance(j + 1);
      }
      continue;
    }
    const close = html.slice(i).match(/^<\/([a-zA-Z][\w:-]*)\s*>/);
    if (close) {
      push({ type: 'close', name: close[1].toLowerCase(), line: startLine });
      advance(i + close[0].length);
      continue;
    }
    const open = html.slice(i).match(/^<([a-zA-Z][\w:-]*)/);
    if (!open) {
      push({ type: 'error', message: 'stray "<" that does not start a tag', line: startLine });
      advance(i + 1);
      continue;
    }
    // Scan to the closing ">" while skipping quoted attribute values.
    let j = i + open[0].length;
    let quote = null;
    for (; j < n; j++) {
      const c = html[j];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === '>') {
        break;
      }
    }
    if (j >= n) {
      push({ type: 'error', message: `unterminated <${open[1].toLowerCase()}> tag`, line: startLine });
      advance(n);
      continue;
    }
    const name = open[1].toLowerCase();
    const rawAttrs = html.slice(i + open[0].length, j);
    const selfClosing = /\/\s*$/.test(rawAttrs);
    push({ type: 'open', name, attrs: parseAttrs(rawAttrs), selfClosing, line: startLine });
    advance(j + 1);
    if (RAW_TEXT.has(name) && !selfClosing) {
      const endRe = new RegExp(`</${name}\\s*>`, 'i');
      const rest = html.slice(i);
      const m = rest.match(endRe);
      const end = m ? i + m.index : n;
      if (end > i) push({ type: 'rawtext', name, text: html.slice(i, end), line });
      advance(end);
    }
  }
  return tokens;
}

// Walks the tokens, keeping a stack of open elements. Returns { problems, tokens }.
// Each open/text/close token gets `node` (innermost open element at that point, null at top level).
// An element node is { name, attrs, line, parent }.
export function parse(html) {
  const tokens = tokenize(html);
  const problems = [];
  let current = null;
  for (const t of tokens) {
    if (t.type === 'error') {
      problems.push({ line: t.line, message: t.message });
    } else if (t.type === 'open') {
      t.node = current;
      if (!VOID.has(t.name) && !t.selfClosing) {
        current = { name: t.name, attrs: t.attrs, line: t.line, parent: current };
      }
      t.element = VOID.has(t.name) || t.selfClosing ? { name: t.name, attrs: t.attrs, line: t.line, parent: t.node } : current;
    } else if (t.type === 'close') {
      t.node = current;
      if (VOID.has(t.name)) {
        problems.push({ line: t.line, message: `</${t.name}> closes a void element` });
        continue;
      }
      let probe = current;
      while (probe && probe.name !== t.name) probe = probe.parent;
      if (!probe) {
        problems.push({ line: t.line, message: `</${t.name}> has no matching open tag` });
        continue;
      }
      while (current !== probe) {
        problems.push({ line: current.line, message: `<${current.name}> opened here is not closed before </${t.name}> on line ${t.line}` });
        current = current.parent;
      }
      current = probe.parent;
    } else {
      t.node = current;
    }
  }
  while (current) {
    problems.push({ line: current.line, message: `<${current.name}> opened here is never closed` });
    current = current.parent;
  }
  problems.sort((a, b) => a.line - b.line);
  return { problems, tokens };
}

// Returns a list of "line N: message" strings. Empty means balanced.
export function checkBalance(html) {
  return parse(html).problems.map((p) => `line ${p.line}: ${p.message}`);
}

export function hasAncestor(node, predicate) {
  for (let n = node; n; n = n.parent) if (predicate(n)) return true;
  return false;
}

export function hasClass(node, cls) {
  return (node.attrs.class || '').split(/\s+/).includes(cls);
}

// Collapses whitespace, decodes entities, and straightens curly apostrophes.
export function normalizeText(text) {
  return decodeEntities(text).replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
}

// Text a visitor can see: body text only, no comments, script, style or title, tags removed.
// Inline tags join their text without a gap; block tags separate it with a space.
export function visibleText(html) {
  const { tokens } = parse(html);
  let out = '';
  for (const t of tokens) {
    if (t.type === 'text') {
      if (hasAncestor(t.node, (n) => n.name === 'head' || n.name === 'title' || n.name === 'template')) continue;
      out += t.text;
    } else if ((t.type === 'open' || t.type === 'close') && !INLINE.has(t.name)) {
      out += ' ';
    }
  }
  return normalizeText(out);
}
