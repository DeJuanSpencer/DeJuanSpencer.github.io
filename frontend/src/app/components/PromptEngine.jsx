"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight, ChevronLeft, Layers, Target, Brain, ShieldOff,
  Sliders, AlertTriangle, FileText, BookOpen, Check, Copy,
  Sparkles, PanelRightOpen, PanelRightClose, Loader2, RefreshCw,
  Zap, ToggleLeft, ToggleRight, ArrowUp, ArrowDown,
  CheckCircle2, Circle, X, Lightbulb, Wand2, Download
} from "lucide-react";

const VERSION = "v1.6";

const STEPS = [
  { id: "context",   label: "Project Context",    icon: Layers,        desc: "Define what you're building" },
  { id: "identity",  label: "Identity",            icon: Target,        desc: "Assign Claude's role" },
  { id: "knowledge", label: "Knowledge Base",      icon: Brain,         desc: "Map what you know" },
  { id: "negative",  label: "Negative Space",      icon: ShieldOff,     desc: "Define what to avoid" },
  { id: "modes",     label: "Mode Architecture",   icon: Sliders,       desc: "Set operational modes" },
  { id: "priority",  label: "Priority Hierarchy",  icon: ArrowUp,       desc: "Resolve conflicts" },
  { id: "failure",   label: "Failure Preemption",  icon: AlertTriangle, desc: "Block failure patterns" },
  { id: "templates", label: "Output Templates",    icon: FileText,      desc: "Optional response formats" },
  { id: "examples",  label: "Concrete Examples",   icon: BookOpen,      desc: "Anchor ideal behavior" },
  { id: "export",    label: "Review & Export",     icon: Download,      desc: "Compile instructions" },
];

const LOADING_PHRASES = [
  "Thinking...", "Analyzing your context...", "Mapping the domain...",
  "Constructing the framework...", "Calibrating precision...",
  "Shaping the architecture...", "Refining the output...", "Almost there...",
];

const extractJSON = (text) => {
  const stripped = text.replace(/```json\s?|```/g, "").trim();
  const firstBrace = stripped.indexOf("{");
  const firstBracket = stripped.indexOf("[");
  let start = -1, opener, closer;
  if (firstBrace === -1 && firstBracket === -1) return null;
  if (firstBrace === -1) { start = firstBracket; opener = "["; closer = "]"; }
  else if (firstBracket === -1) { start = firstBrace; opener = "{"; closer = "}"; }
  else if (firstBracket < firstBrace) { start = firstBracket; opener = "["; closer = "]"; }
  else { start = firstBrace; opener = "{"; closer = "}"; }
  let depth = 0;
  for (let i = start; i < stripped.length; i++) {
    if (stripped[i] === opener) depth++;
    else if (stripped[i] === closer) { depth--; if (depth === 0) return stripped.slice(start, i + 1); }
  }
  return null;
};

const callClaude = async (systemPrompt, userPrompt, maxTokens = 2000) => {
  try {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.stop_reason === "max_tokens") throw new Error("Response truncated");
    const text = data.content?.map(i => i.type === "text" ? i.text : "").join("\n") || "";
    const json = extractJSON(text);
    if (!json) throw new Error("No JSON found in response");
    return JSON.parse(json);
  } catch (err) {
    console.error("Claude API error:", err.message);
    return null;
  }
};

const Badge = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: "6px",
    border: active ? "1.5px solid #d4a24e" : "1.5px solid rgba(255,255,255,0.1)",
    background: active ? "rgba(212,162,78,0.15)" : "rgba(255,255,255,0.03)",
    color: active ? "#d4a24e" : "rgba(255,255,255,0.6)",
    fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
    fontFamily: "'JetBrains Mono', monospace",
  }}>{children}</button>
);

const Card = ({ children, style, highlight }) => (
  <div style={{
    background: highlight ? "rgba(212,162,78,0.06)" : "rgba(255,255,255,0.03)",
    border: highlight ? "1px solid rgba(212,162,78,0.3)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px", padding: "16px", ...style,
  }}>{children}</div>
);

const Btn = ({ children, onClick, primary, disabled, small, style: s }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "6px 14px" : "10px 20px", borderRadius: "8px",
    border: primary ? "none" : "1px solid rgba(255,255,255,0.12)",
    background: primary
      ? disabled ? "rgba(212,162,78,0.3)" : "linear-gradient(135deg, #d4a24e, #b8862e)"
      : "rgba(255,255,255,0.05)",
    color: primary ? (disabled ? "rgba(255,255,255,0.4)" : "#1a1a1a") : "rgba(255,255,255,0.75)",
    fontSize: small ? "12px" : "14px", fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", gap: "8px",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", ...s,
  }}>{children}</button>
);

const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows} style={{
      width: "100%", background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
      padding: "12px 14px", color: "#e0e0e0", fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none",
      lineHeight: 1.6, boxSizing: "border-box",
    }} />
);

const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} style={{
      width: "100%", background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
      padding: "10px 14px", color: "#e0e0e0", fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
    }} />
);

const SectionLabel = ({ children, sub }) => (
  <div style={{ marginBottom: sub ? "8px" : "16px" }}>
    <div style={{
      fontSize: sub ? "12px" : "13px", fontFamily: "'JetBrains Mono', monospace",
      color: sub ? "rgba(255,255,255,0.4)" : "#d4a24e",
      textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600,
    }}>{children}</div>
  </div>
);

const Toast = ({ msg }) => (
  <div style={{
    position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
    background: "#dc5050", color: "#fff", padding: "10px 18px",
    borderRadius: "8px", fontSize: "13px", fontWeight: 600, zIndex: 9999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  }}>{msg}</div>
);

const LoadingIndicator = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [dots, setDots] = useState("");
  useEffect(() => {
    const phraseTimer = setInterval(() => setPhraseIdx(prev => (prev + 1) % LOADING_PHRASES.length), 2400);
    const dotTimer = setInterval(() => setDots(prev => prev.length >= 3 ? "" : prev + "."), 500);
    return () => { clearInterval(phraseTimer); clearInterval(dotTimer); };
  }, []);
  return (
    <div style={{ padding: "20px 24px", marginBottom: "16px", background: "linear-gradient(135deg, rgba(212,162,78,0.08), rgba(212,162,78,0.03))", border: "1px solid rgba(212,162,78,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(212,162,78,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "glow 2s ease-in-out infinite" }}>
        <Loader2 size={20} color="#d4a24e" className="spin" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#d4a24e", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>{LOADING_PHRASES[phraseIdx]}</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px" }}>claude-sonnet generating{dots}</div>
      </div>
      <div style={{ width: "60px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ width: "40%", height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #d4a24e, #b8862e)", animation: "shimmerBar 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
};

const Fireworks = () => {
  const [particles] = useState(() => Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360;
    const distance = 60 + Math.random() * 80;
    const colors = ["#d4a24e", "#f0c674", "#b8862e", "#ffd700", "#ff9500", "#50b450"];
    return { x: Math.cos(angle * Math.PI / 180) * distance, y: Math.sin(angle * Math.PI / 180) * distance, size: 4 + Math.random() * 6, delay: Math.random() * 300, duration: 800 + Math.random() * 400, color: colors[Math.floor(Math.random() * colors.length)], id: i };
  }));
  const [positions, setPositions] = useState({});
  useEffect(() => {
    const timers = particles.map(p => setTimeout(() => setPositions(prev => ({ ...prev, [p.id]: true })), p.delay));
    return () => timers.forEach(t => clearTimeout(t));
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {particles.map(p => (
        <div key={p.id} style={{ position: "absolute", width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%", background: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}`, transform: positions[p.id] ? `translate(${p.x}px, ${p.y}px) scale(0.3)` : "translate(0,0) scale(1)", opacity: positions[p.id] ? 0 : 1, transition: `transform ${p.duration}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${p.duration}ms ease` }} />
      ))}
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#d4a24e", fontFamily: "'DM Sans', sans-serif", textShadow: "0 0 20px rgba(212,162,78,0.5)", animation: "fadeInScale 0.4s 0.2s ease forwards", opacity: 0 }}>Instructions Copied!</div>
    </div>
  );
};

export default function PromptEngine() {
  const [step, setStep] = useState(0);
  const [appMode, setAppMode] = useState("create");
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBlurb, setCopiedBlurb] = useState(false);
  const [error, setError] = useState(null);
  const [showAssist, setShowAssist] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [itemLoading, setItemLoading] = useState({});
  const [generateLoading, setGenerateLoading] = useState({});
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const lastActivity = useRef(Date.now());
  const idleTimer = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [domain, setDomain] = useState("");
  const [goals, setGoals] = useState("");
  const [customInjection, setCustomInjection] = useState("");
  const [refineLoading, setRefineLoading] = useState({});
  const [refineSuggestions, setRefineSuggestions] = useState({});
  const [identityOptions, setIdentityOptions] = useState([]);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [knowledgeResult, setKnowledgeResult] = useState([]);
  const [negativeSuggestions, setNegativeSuggestions] = useState([]);
  const [selectedNegatives, setSelectedNegatives] = useState(new Set());
  const [modes, setModes] = useState([]);
  const [defaultModeIdx, setDefaultModeIdx] = useState(0);
  const [priorities, setPriorities] = useState([]);
  const [failures, setFailures] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templatesEnabled, setTemplatesEnabled] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState(new Set());
  const [examples, setExamples] = useState([]);
  const [approvedExamples, setApprovedExamples] = useState(new Set());
  const [compiledOutput, setCompiledOutput] = useState("");
  const [pastedInstructions, setPastedInstructions] = useState("");
  const [parsedPreview, setParsedPreview] = useState(null);
  const [selectedSections, setSelectedSections] = useState(new Set());

  const showError = (msg) => { setError(msg); setTimeout(() => setError(null), 4000); };

  useEffect(() => {
    const checkIdle = () => { if (Date.now() - lastActivity.current > 45000 && step < 9) setShowAssist(true); };
    idleTimer.current = setInterval(checkIdle, 15000);
    return () => clearInterval(idleTimer.current);
  }, [step]);

  const trackActivity = useCallback(() => { lastActivity.current = Date.now(); setShowAssist(false); }, []);

  const buildOutput = useCallback(() => {
    let out = "";
    out += `## Project Frame Protocol\nThe first conversation in this project is the strategic layer. Use it to establish high-level context, goals, and operating frame for everything that follows. All subsequent conversations are execution within that frame unless the user explicitly opens a new strategic conversation.\n\n`;
    if (selectedIdentity !== null && identityOptions[selectedIdentity]) {
      const id = identityOptions[selectedIdentity];
      out += `## Identity\nYou are a ${id.title}. ${id.description}\nKey traits: ${id.traits?.join(", ")}\n\n`;
    }
    if (knowledgeResult.length > 0) out += `## Assumed Knowledge\n${knowledgeResult.map(k => `- ${k}`).join("\n")}\n\n`;
    const negs = [...selectedNegatives].map(i => negativeSuggestions[i]).filter(Boolean);
    if (negs.length > 0) out += `## Do NOT\n${negs.map(n => `- ${n.instruction}`).join("\n")}\n\n`;
    if (modes.length > 0) {
      out += `## Operational Modes\n`;
      modes.forEach((m, i) => { out += `### ${m.name}${i === defaultModeIdx ? " [DEFAULT]" : ""}\nTrigger: "${m.trigger}"\n${m.description}\n\n`; });
    }
    if (priorities.length > 0) {
      out += `## Priority Hierarchy\n`;
      priorities.forEach((p, i) => { out += `${i + 1}. ${p.rule} (overrides: ${p.overrides}; exception: ${p.exception})\n`; });
      out += "\n";
    }
    if (failures.length > 0) out += `## Failure Preemption\n${failures.map(f => `- ${f.prevention} [blocks: ${f.pattern}]`).join("\n")}\n\n`;
    if (templatesEnabled && selectedTemplates.size > 0) {
      const ts = [...selectedTemplates].map(i => templates[i]).filter(Boolean);
      if (ts.length > 0) { out += `## Output Templates\n`; ts.forEach(t => { out += `### ${t.name}\nWhen: ${t.trigger}\nFormat:\n${t.format}\n\n`; }); }
    }
    const exs = [...approvedExamples].map(i => examples[i]).filter(Boolean);
    if (exs.length > 0) { out += `## Reference Examples\n`; exs.forEach((e, i) => { out += `### Example ${i + 1}\nUser: ${e.userMessage}\nAssistant: ${e.idealResponse}\n\n`; }); }
    if (customInjection.trim()) out += `## Additional Instructions\n${customInjection.trim()}\n`;
    return out || "Complete at least one step to see output here.";
  }, [selectedIdentity, identityOptions, knowledgeResult, selectedNegatives, negativeSuggestions, modes, defaultModeIdx, priorities, failures, templatesEnabled, selectedTemplates, templates, approvedExamples, examples, customInjection]);

  useEffect(() => { setCompiledOutput(buildOutput()); }, [buildOutput]);

  const getContext = () => ({
    name: projectName, description: projectDesc, domain, goals,
    identity: selectedIdentity !== null ? identityOptions[selectedIdentity] : null,
    knowledge: knowledgeResult, negatives: [...selectedNegatives].map(i => negativeSuggestions[i]),
    modes, priorities, failures,
  });

  const withLoading = async (fn) => {
    setLoading(true); trackActivity();
    try { await fn(); }
    catch (e) { showError("Something went wrong."); console.error(e); }
    finally { setLoading(false); }
  };

  const generateField = async (field) => {
    setGenerateLoading(p => ({ ...p, [field]: true })); trackActivity();
    const ctx = { name: projectName, domain, description: projectDesc, goals };
    const other = Object.entries(ctx).filter(([k]) => k !== field && ctx[k]).map(([k, v]) => `${k}: ${v}`).join("\n");
    const prompts = {
      name: { system: `You generate a clear concise project name for an AI project. Return ONLY valid JSON: {"generated":"the project name"}`, user: `Generate a project name.\nContext:\n${other || "No context yet."}` },
      domain: { system: `You generate a precise domain label for an AI project. Return ONLY valid JSON: {"generated":"specific domain label"}`, user: `Generate a domain label.\nContext:\n${other || "No context yet."}` },
      description: { system: `You generate a clear 2-3 sentence project description for an AI project. Return ONLY valid JSON: {"generated":"project description text"}`, user: `Generate a project description.\nContext:\n${other || "No context yet."}` },
      goals: { system: `You generate sharp measurable project goals for an AI project. Return ONLY valid JSON: {"generated":"goal text"}`, user: `Generate project goals.\nContext:\n${other || "No context yet."}` },
    };
    const p = prompts[field];
    const result = await callClaude(p.system, p.user);
    if (result?.generated) {
      if (field === "name") setProjectName(result.generated);
      if (field === "domain") setDomain(result.generated);
      if (field === "description") setProjectDesc(result.generated);
      if (field === "goals") setGoals(result.generated);
    } else showError(`Generate failed for ${field}.`);
    setGenerateLoading(p => ({ ...p, [field]: false }));
  };

  const refineField = async (field) => {
    setRefineLoading(p => ({ ...p, [field]: true })); trackActivity();
    const vals = { name: projectName, domain, description: projectDesc, goals };
    const fieldValue = vals[field] || "";
    const other = Object.entries(vals).filter(([k]) => k !== field && vals[k]).map(([k, v]) => `${k}: ${v}`).join("\n");
    const prompts = {
      name: { system: `You help users craft clear concise project names for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined project name","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Project Name: "${fieldValue}"\nContext:\n${other}` },
      domain: { system: `You help users define precise domain labels for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined domain label","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Domain: "${fieldValue}"\nContext:\n${other}` },
      description: { system: `You help users write precise project descriptions for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined description text","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Description: "${fieldValue}"\nContext:\n${other}` },
      goals: { system: `You help users define sharp measurable project goals for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined goals text","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Goals: "${fieldValue}"\nContext:\n${other}` },
    };
    const p = prompts[field];
    if (!p) { setRefineLoading(prev => ({ ...prev, [field]: false })); return; }
    const result = await callClaude(p.system, p.user);
    if (result?.improved) setRefineSuggestions(prev => ({ ...prev, [field]: result }));
    else { showError("Refine failed."); console.error("Refine result:", result); }
    setRefineLoading(prev => ({ ...prev, [field]: false }));
  };

  const acceptRefinement = (field, value) => {
    if (field === "name") setProjectName(value);
    if (field === "domain") setDomain(value);
    if (field === "description") setProjectDesc(value);
    if (field === "goals") setGoals(value);
    setRefineSuggestions(prev => { const n = { ...prev }; delete n[field]; return n; });
    trackActivity();
  };
  const dismissRefinement = (field) => { setRefineSuggestions(prev => { const n = { ...prev }; delete n[field]; return n; }); };

  const generateIdentities = () => withLoading(async () => {
    const r = await callClaude(`You generate professional role identities for AI assistants based on project context. Return ONLY valid JSON array of 3 objects: [{"title":"...","description":"...","traits":["...","...","..."]}]`, `Project: ${projectName}\nDescription: ${projectDesc}\nDomain: ${domain}\nGoals: ${goals}`);
    if (r) setIdentityOptions(r); else showError("Identity generation failed.");
  });
  const generateQuiz = () => withLoading(async () => {
    const r = await callClaude(`You create knowledge assessment quizzes for a specific domain. Return ONLY valid JSON array of 5 question objects: [{"id":"q1","question":"...","topic":"...","difficulty":"beginner|intermediate|advanced"}]`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}`);
    if (r) { setQuizQuestions(r); setQuizAnswers({}); } else showError("Quiz generation failed.");
  });
  const processQuizAnswers = () => withLoading(async () => {
    const qa = quizQuestions.map(q => ({ question: q.question, answer: quizAnswers[q.id] || "skipped", topic: q.topic }));
    const r = await callClaude(`You analyze knowledge assessment quiz responses and derive what the user knows. Return ONLY valid JSON array of strings: ["User understands X","User has working knowledge of Y"]`, `Domain: ${domain}\nAnswers: ${JSON.stringify(qa)}`);
    if (r) setKnowledgeResult(r); else showError("Quiz processing failed.");
  });
  const generateNegativeSpace = () => withLoading(async () => {
    const r = await callClaude(`You identify counterproductive AI behaviors for a specific domain and project. Return ONLY valid JSON array: [{"behavior":"short name","instruction":"do not... directive","reason":"why this matters"}]`, `Project: ${projectName}\nDomain: ${domain}\nDescription: ${projectDesc}`);
    if (r) { setNegativeSuggestions(r); setSelectedNegatives(new Set(r.map((_, i) => i))); } else showError("Negative space generation failed.");
  });
  const generateModes = () => withLoading(async () => {
    const r = await callClaude(`You design operational modes for AI assistants. Return ONLY valid JSON: {"modes":[{"name":"...","trigger":"one word or short phrase","description":"...","characteristics":["...","...","..."]}],"defaultMode":0}`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}\nGoals: ${goals}`);
    if (r) { setModes(r.modes || []); setDefaultModeIdx(r.defaultMode || 0); } else showError("Mode generation failed.");
  });
  const regenerateMode = async (idx) => {
    setItemLoading(p => ({ ...p, [`mode_${idx}`]: true }));
    const r = await callClaude(`You design a single operational mode for an AI assistant. Return ONLY valid JSON object: {"name":"...","trigger":"one word or short phrase","description":"...","characteristics":["...","...","..."]}`, `Domain: ${domain}\nProject: ${projectName}\nExisting modes to avoid duplicating: ${modes.map(m => m.name).join(", ")}`);
    if (r) setModes(prev => prev.map((m, i) => i === idx ? r : m)); else showError("Regenerate failed.");
    setItemLoading(p => ({ ...p, [`mode_${idx}`]: false }));
  };
  const generatePriorities = () => withLoading(async () => {
    const ctx = getContext();
    const r = await callClaude(`You define priority hierarchies that resolve conflicts between AI behavioral rules. Return ONLY valid JSON array ordered highest to lowest: [{"rule":"clear priority statement","overrides":"what lower rule this beats","exception":"when this rule does not apply"}]`, `Project: ${projectName}\nDomain: ${domain}\nIdentity: ${JSON.stringify(ctx.identity)}`);
    if (r) setPriorities(r); else showError("Priority generation failed.");
  });
  const regeneratePriority = async (idx) => {
    setItemLoading(p => ({ ...p, [`priority_${idx}`]: true }));
    const ctx = getContext();
    const r = await callClaude(`You define a single priority rule for AI behavior conflict resolution. Return ONLY valid JSON object: {"rule":"clear priority statement","overrides":"what this beats","exception":"when it doesn't apply"}`, `Project: ${projectName}\nDomain: ${domain}\nIdentity: ${JSON.stringify(ctx.identity)}\nExisting rules to avoid duplicating: ${priorities.map(p => p.rule).join("; ")}`);
    if (r) setPriorities(prev => prev.map((p, i) => i === idx ? r : p)); else showError("Regenerate failed.");
    setItemLoading(p => ({ ...p, [`priority_${idx}`]: false }));
  };
  const generateFailures = () => withLoading(async () => {
    const r = await callClaude(`You identify common AI failure patterns in a specific domain. Return ONLY valid JSON array: [{"pattern":"name of failure pattern","prevention":"specific instruction to prevent it","severity":"low|medium|high"}]`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}`);
    if (r) setFailures(r); else showError("Failure generation failed.");
  });
  const regenerateFailure = async (idx) => {
    setItemLoading(p => ({ ...p, [`failure_${idx}`]: true }));
    const r = await callClaude(`You identify a single AI failure pattern for a specific domain. Return ONLY valid JSON object: {"pattern":"name of failure pattern","prevention":"specific instruction to prevent it","severity":"low|medium|high"}`, `Domain: ${domain}\nProject: ${projectName}\nExisting patterns to avoid duplicating: ${failures.map(f => f.pattern).join("; ")}`);
    if (r) setFailures(prev => prev.map((f, i) => i === idx ? r : f)); else showError("Regenerate failed.");
    setItemLoading(p => ({ ...p, [`failure_${idx}`]: false }));
  };
  const generateTemplates = () => withLoading(async () => {
    const r = await callClaude(`You design response format templates for AI assistants. Return ONLY valid JSON array of 4 objects: [{"name":"template name","trigger":"when to use this","format":"the actual format structure with placeholders"}]`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}`);
    if (r) { setTemplates(r); setSelectedTemplates(new Set()); } else showError("Template generation failed.");
  });
  const generateExamples = () => withLoading(async () => {
    const ctx = getContext();
    const r = await callClaude(`You create ideal example interactions for AI assistants. Return ONLY valid JSON array of 3 objects: [{"userMessage":"realistic user input","idealResponse":"ideal assistant response","reasoning":"why this response is ideal"}]`, `Project: ${projectName}\nDomain: ${domain}\nIdentity: ${JSON.stringify(ctx.identity)}\nNegatives: ${JSON.stringify(ctx.negatives)}`, 3000);
    if (r) { setExamples(r); setApprovedExamples(new Set()); } else showError("Example generation failed.");
  });

  const autoFillCurrent = () => withLoading(async () => {
    const id = STEPS[step].id;
    if (id === "context") {
      if (!projectName) await generateField("name");
      if (!domain) await generateField("domain");
      if (!projectDesc) await generateField("description");
      if (!goals) await generateField("goals");
    }
    if (id === "identity" && !identityOptions.length) await generateIdentities();
    if (id === "knowledge" && !quizQuestions.length) await generateQuiz();
    if (id === "negative" && !negativeSuggestions.length) await generateNegativeSpace();
    if (id === "modes" && !modes.length) await generateModes();
    if (id === "priority" && !priorities.length) await generatePriorities();
    if (id === "failure" && !failures.length) await generateFailures();
    if (id === "templates" && !templates.length) await generateTemplates();
    if (id === "examples" && !examples.length) await generateExamples();
  });

  const handleEditParse = () => withLoading(async () => {
    const r = await callClaude(
      `You decompose existing Claude project instructions into their structured component levers. Extract every piece of information you can find. Return ONLY valid JSON with this exact shape:
{"projectName":"...","domain":"...","description":"...","goals":"...","identity":{"title":"...","description":"...","traits":[]},"knowledge":[],"negatives":[{"behavior":"...","instruction":"...","reason":"..."}],"modes":[{"name":"...","trigger":"...","description":"...","characteristics":[]}],"priorities":[{"rule":"...","overrides":"...","exception":"..."}],"failures":[{"pattern":"...","prevention":"...","severity":"medium"}],"templates":[],"examples":[]}`,
      `Decompose these project instructions into structured levers:\n\n${pastedInstructions}`, 3000
    );
    if (r) {
      setParsedPreview(r);
      const available = new Set();
      if (r.projectName || r.domain || r.description || r.goals) available.add("context");
      if (r.identity?.title) available.add("identity");
      if (r.knowledge?.length) available.add("knowledge");
      if (r.negatives?.length) available.add("negatives");
      if (r.modes?.length) available.add("modes");
      if (r.priorities?.length) available.add("priorities");
      if (r.failures?.length) available.add("failures");
      if (r.templates?.length) available.add("templates");
      if (r.examples?.length) available.add("examples");
      if (available.size === 0) { showError("Nothing could be extracted. Check your instructions format."); return; }
      setSelectedSections(available);
    } else showError("Parse failed. Check your input format.");
  });

  const applyParsed = () => {
    const r = parsedPreview;
    if (selectedSections.has("context")) {
      if (r.projectName) setProjectName(r.projectName);
      if (r.domain) setDomain(r.domain);
      if (r.description) setProjectDesc(r.description);
      if (r.goals) setGoals(r.goals);
    }
    if (selectedSections.has("identity") && r.identity?.title) { setIdentityOptions([r.identity]); setSelectedIdentity(0); }
    if (selectedSections.has("knowledge") && r.knowledge?.length) setKnowledgeResult(r.knowledge);
    if (selectedSections.has("negatives") && r.negatives?.length) { setNegativeSuggestions(r.negatives); setSelectedNegatives(new Set(r.negatives.map((_, i) => i))); }
    if (selectedSections.has("modes") && r.modes?.length) setModes(r.modes);
    if (selectedSections.has("priorities") && r.priorities?.length) setPriorities(r.priorities);
    if (selectedSections.has("failures") && r.failures?.length) setFailures(r.failures);
    if (selectedSections.has("templates") && r.templates?.length) { setTemplates(r.templates); setTemplatesEnabled(true); setSelectedTemplates(new Set(r.templates.map((_, i) => i))); }
    if (selectedSections.has("examples") && r.examples?.length) { setExamples(r.examples); setApprovedExamples(new Set(r.examples.map((_, i) => i))); }
    setParsedPreview(null); setPastedInstructions(""); setAppMode("create"); setStep(0);
  };

  const copyToClipboard = async () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = compiledOutput;
      Object.assign(ta.style, { position: "fixed", left: "-9999px", top: "-9999px", opacity: "0" });
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      setCopied(true); setShowFireworks(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowFireworks(false), 3000);
    } catch {
      try { await navigator.clipboard.writeText(compiledOutput); setCopied(true); setShowFireworks(true); setTimeout(() => setCopied(false), 2000); setTimeout(() => setShowFireworks(false), 3000); }
      catch { showError("Copy failed. Try selecting the text manually."); }
    }
  };

  const copyBlurb = async () => {
    const projectBlurb = `${projectDesc}${goals ? " Goal: " + goals.trim().replace(/\.?\s*$/, ".") : ""}`.trim();
    try {
      const ta = document.createElement("textarea");
      ta.value = projectBlurb;
      Object.assign(ta.style, { position: "fixed", left: "-9999px", top: "-9999px", opacity: "0" });
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      setCopiedBlurb(true); setTimeout(() => setCopiedBlurb(false), 2000);
    } catch {
      try { await navigator.clipboard.writeText(projectBlurb); setCopiedBlurb(true); setTimeout(() => setCopiedBlurb(false), 2000); }
      catch { showError("Copy failed."); }
    }
  };

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDragEnd = () => {
    if (dragIdx !== null && dragOverIdx !== null && dragIdx !== dragOverIdx) {
      const arr = [...priorities]; const [moved] = arr.splice(dragIdx, 1); arr.splice(dragOverIdx, 0, moved); setPriorities(arr);
    }
    setDragIdx(null); setDragOverIdx(null);
  };
  const movePriority = (idx, dir) => {
    const arr = [...priorities]; const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]]; setPriorities(arr);
  };

  const projectBlurb = `${projectDesc}${goals ? " Goal: " + goals.trim().replace(/\.?\s*$/, ".") : ""}`.trim();
  const canAdvance = () => step === 0 ? (projectName && domain && projectDesc) : true;

  const RefinePanel = ({ field, suggestion }) => {
    if (!suggestion) return null;
    return (
      <div style={{ marginTop: "10px", background: "rgba(212,162,78,0.04)", border: "1px solid rgba(212,162,78,0.2)", borderRadius: "10px", padding: "14px 16px" }}>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "10px", fontStyle: "italic" }}>{suggestion.reasoning}</div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "#d4a24e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>Refined Version</div>
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "10px 12px", color: "#e0e0e0", fontSize: "13px", lineHeight: 1.6, borderLeft: "2px solid #d4a24e" }}>{suggestion.improved}</div>
          <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
            <Btn small primary onClick={() => acceptRefinement(field, suggestion.improved)}><Check size={12} /> Accept</Btn>
            <Btn small onClick={() => dismissRefinement(field)}><X size={12} /> Dismiss</Btn>
          </div>
        </div>
        {suggestion.alternatives?.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>Alternatives</div>
            {suggestion.alternatives.map((alt, i) => (
              <div key={i} onClick={() => acceptRefinement(field, alt)} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "8px 12px", color: "rgba(255,255,255,0.7)", fontSize: "13px", lineHeight: 1.5, marginBottom: "6px", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ flex: 1 }}>{alt}</span>
                <span style={{ fontSize: "10px", color: "rgba(212,162,78,0.6)", whiteSpace: "nowrap" }}>use this</span>
              </div>
            ))}
          </div>
        )}
        {suggestion.tips?.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
            <Lightbulb size={12} color="rgba(255,255,255,0.3)" style={{ marginTop: "2px" }} />
            {suggestion.tips.map((tip, i) => <span key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{tip}{i < suggestion.tips.length - 1 ? " · " : ""}</span>)}
          </div>
        )}
        {suggestion.missingInfo?.length > 0 && (
          <div style={{ marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
            <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(220,80,80,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>You Might Be Missing</div>
            {suggestion.missingInfo.map((info, i) => <div key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", padding: "4px 0", display: "flex", gap: "6px" }}><span style={{ color: "rgba(220,80,80,0.5)" }}>?</span> {info}</div>)}
          </div>
        )}
      </div>
    );
  };

  const RefineBtn = ({ field, disabled }) => (
    <Btn small onClick={() => refineField(field)} disabled={disabled || refineLoading[field]}>
      {refineLoading[field] ? <Loader2 size={12} className="spin" /> : <Wand2 size={12} />} Refine
    </Btn>
  );
  const GenerateBtn = ({ field }) => (
    <Btn small onClick={() => generateField(field)} disabled={generateLoading[field]}>
      {generateLoading[field] ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />} Generate
    </Btn>
  );

  const renderContext = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {[
        ["Project Name", "name", projectName, setProjectName, false, "My AI project"],
        ["Domain", "domain", domain, setDomain, false, "e.g. B2B SaaS sales, medical research, creative writing..."],
        ["Project Description", "description", projectDesc, setProjectDesc, true, "What is this Claude project designed to do?"],
        ["Goals", "goals", goals, setGoals, true, "What outcomes should this project produce?"],
      ].map(([label, field, val, setter, isTextarea, placeholder]) => (
        <div key={field}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
            <SectionLabel>{label}</SectionLabel>
            <div style={{ display: "flex", gap: "6px" }}>
              <GenerateBtn field={field} />
              <RefineBtn field={field} disabled={!val} />
            </div>
          </div>
          {isTextarea
            ? <TextArea value={val} onChange={v => { setter(v); trackActivity(); }} placeholder={placeholder} />
            : <Input value={val} onChange={v => { setter(v); trackActivity(); }} placeholder={placeholder} />
          }
          <RefinePanel field={field} suggestion={refineSuggestions[field]} />
        </div>
      ))}
    </div>
  );

  const renderIdentity = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Choose Claude's Identity</SectionLabel>
        <Btn small onClick={generateIdentities} disabled={loading || !projectDesc}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{identityOptions.length ? "Regenerate" : "Generate Options"}</Btn>
      </div>
      {!identityOptions.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Click "Generate Options" to get role suggestions based on your project context.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {identityOptions.map((opt, i) => (
          <Card key={i} highlight={selectedIdentity === i} style={{ cursor: "pointer" }}>
            <div onClick={() => { setSelectedIdentity(i); trackActivity(); }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                {selectedIdentity === i ? <CheckCircle2 size={18} color="#d4a24e" /> : <Circle size={18} color="rgba(255,255,255,0.2)" />}
                <span style={{ fontWeight: 700, color: "#e0e0e0", fontSize: "15px" }}>{opt.title}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: "0 0 8px 28px" }}>{opt.description}</p>
              <div style={{ display: "flex", gap: "6px", marginLeft: "28px", flexWrap: "wrap" }}>
                {opt.traits?.map((t, j) => <span key={j} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderKnowledge = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Knowledge Assessment</SectionLabel>
        <div style={{ display: "flex", gap: "8px" }}>
          {quizQuestions.length > 0 && Object.keys(quizAnswers).length > 0 && <Btn small primary onClick={processQuizAnswers} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Zap size={14} />} Process</Btn>}
          <Btn small onClick={generateQuiz} disabled={loading || !domain}>{loading && !quizQuestions.length ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}{quizQuestions.length ? "New Quiz" : "Generate Quiz"}</Btn>
        </div>
      </div>
      {!quizQuestions.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Generate a quiz to assess your knowledge level. Skip what you don't know.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {quizQuestions.map(q => (
          <Card key={q.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#e0e0e0", fontSize: "14px", fontWeight: 600, flex: 1 }}>{q.question}</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", height: "fit-content", background: q.difficulty === "advanced" ? "rgba(220,80,80,0.15)" : q.difficulty === "intermediate" ? "rgba(212,162,78,0.15)" : "rgba(80,180,80,0.15)", color: q.difficulty === "advanced" ? "#dc5050" : q.difficulty === "intermediate" ? "#d4a24e" : "#50b450", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{q.difficulty}</span>
            </div>
            <TextArea value={quizAnswers[q.id] || ""} onChange={v => { setQuizAnswers({ ...quizAnswers, [q.id]: v }); trackActivity(); }} placeholder="Your answer (or skip)" rows={2} />
          </Card>
        ))}
      </div>
      {knowledgeResult.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <SectionLabel>Derived Knowledge Baseline</SectionLabel>
          {knowledgeResult.map((k, i) => <div key={i} style={{ padding: "8px 12px", fontSize: "13px", color: "rgba(255,255,255,0.7)", borderLeft: "2px solid #d4a24e", marginBottom: "6px", marginLeft: "4px" }}>{k}</div>)}
        </div>
      )}
    </div>
  );

  const renderNegativeSpace = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Select Behaviors to Block</SectionLabel>
        <Btn small onClick={generateNegativeSpace} disabled={loading || !domain}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{negativeSuggestions.length ? "Regenerate" : "Generate Suggestions"}</Btn>
      </div>
      {!negativeSuggestions.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Auto-generated based on your domain. Deselect any that don't apply.</div>}
      {negativeSuggestions.length > 0 && selectedNegatives.size === negativeSuggestions.length && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(80,180,80,0.06)", border: "1px solid rgba(80,180,80,0.2)", borderRadius: "8px" }}>
          <CheckCircle2 size={16} color="#50b450" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>All behaviors selected by default. Deselect any that don't apply to your project.</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {negativeSuggestions.map((n, i) => (
          <Card key={i} highlight={selectedNegatives.has(i)} style={{ cursor: "pointer" }}>
            <div onClick={() => { const next = new Set(selectedNegatives); next.has(i) ? next.delete(i) : next.add(i); setSelectedNegatives(next); trackActivity(); }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                {selectedNegatives.has(i) ? <CheckCircle2 size={16} color="#d4a24e" style={{ marginTop: "2px", flexShrink: 0 }} /> : <Circle size={16} color="rgba(255,255,255,0.2)" style={{ marginTop: "2px", flexShrink: 0 }} />}
                <div><div style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600 }}>{n.behavior}</div><div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "2px" }}>{n.reason}</div></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderModes = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Operational Modes</SectionLabel>
        <Btn small onClick={generateModes} disabled={loading || !domain}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{modes.length ? "Regenerate All" : "Generate Modes"}</Btn>
      </div>
      {!modes.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Modes give you switchable behavior profiles within the same project.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {modes.map((m, i) => (
          <Card key={i} highlight={i === defaultModeIdx}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#e0e0e0", fontSize: "15px" }}>{m.name}</span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: "rgba(212,162,78,0.15)", color: "#d4a24e", fontFamily: "'JetBrains Mono', monospace" }}>"{m.trigger}"</span>
                  {i === defaultModeIdx && <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(80,180,80,0.15)", color: "#50b450", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>default</span>}
                </div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", margin: "4px 0 8px" }}>{m.description}</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {m.characteristics?.map((c, j) => <span key={j} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>{c}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "10px", flexShrink: 0 }}>
                <Btn small onClick={() => { setDefaultModeIdx(i); trackActivity(); }} style={{ opacity: i === defaultModeIdx ? 0.4 : 1 }}>Set Default</Btn>
                <Btn small onClick={() => regenerateMode(i)} disabled={itemLoading[`mode_${i}`]}>{itemLoading[`mode_${i}`] ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />} Redo</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPriority = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Priority Rules</SectionLabel>
        <Btn small onClick={generatePriorities} disabled={loading || !domain}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{priorities.length ? "Regenerate All" : "Generate"}</Btn>
      </div>
      {!priorities.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Priority rules resolve conflicts when two instructions compete. Higher = wins.</div>}
      {priorities.length > 0 && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>Drag to reorder or use arrows. Higher position = higher priority.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {priorities.map((p, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "grab", opacity: dragIdx === i ? 0.5 : 1, borderColor: dragOverIdx === i ? "rgba(212,162,78,0.5)" : undefined, transform: dragOverIdx === i ? "scale(1.02)" : "scale(1)", transition: "transform 0.2s, border-color 0.2s, opacity 0.2s" }}
            draggable onDragStart={() => handleDragStart(i)} onDragOver={e => handleDragOver(e, i)} onDragEnd={handleDragEnd}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
              <Sliders size={14} color="rgba(255,255,255,0.2)" style={{ cursor: "grab", marginRight: "4px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <button onClick={e => { e.stopPropagation(); movePriority(i, -1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", lineHeight: 0, borderRadius: "4px" }}><ArrowUp size={12} color="rgba(255,255,255,0.35)" /></button>
                <button onClick={e => { e.stopPropagation(); movePriority(i, 1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", lineHeight: 0, borderRadius: "4px" }}><ArrowDown size={12} color="rgba(255,255,255,0.35)" /></button>
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#d4a24e", minWidth: "20px" }}>P{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600 }}>{p.rule}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>Overrides: {p.overrides} | Exception: {p.exception}</div>
            </div>
            <Btn small onClick={() => regeneratePriority(i)} disabled={itemLoading[`priority_${i}`]}>{itemLoading[`priority_${i}`] ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />} Redo</Btn>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFailure = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Failure Mode Preemption</SectionLabel>
        <Btn small onClick={generateFailures} disabled={loading || !domain}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{failures.length ? "Regenerate All" : "Generate"}</Btn>
      </div>
      {!failures.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Domain-specific failure patterns Claude should be explicitly blocked from.</div>}
      {failures.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(212,162,78,0.06)", border: "1px solid rgba(212,162,78,0.15)", borderRadius: "8px" }}>
          <ShieldOff size={16} color="#d4a24e" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>All patterns will be included in your compiled instructions. Use "Redo" to replace any that don't fit.</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {failures.map((f, i) => (
          <Card key={i}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <AlertTriangle size={16} color={f.severity === "high" ? "#dc5050" : f.severity === "medium" ? "#d4a24e" : "rgba(255,255,255,0.3)"} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600 }}>{f.pattern}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>Severity: {f.severity}</div>
                <div style={{ color: "rgba(212,162,78,0.8)", fontSize: "12px", marginTop: "4px" }}>Prevention: {f.prevention}</div>
              </div>
              <Btn small onClick={() => regenerateFailure(i)} disabled={itemLoading[`failure_${i}`]}>{itemLoading[`failure_${i}`] ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />} Redo</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SectionLabel>Output Templates</SectionLabel>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>optional</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => { setTemplatesEnabled(!templatesEnabled); trackActivity(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {templatesEnabled ? <ToggleRight size={28} color="#d4a24e" /> : <ToggleLeft size={28} color="rgba(255,255,255,0.3)" />}
          </button>
          <Btn small onClick={generateTemplates} disabled={loading || !domain || !templatesEnabled}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} Generate</Btn>
        </div>
      </div>
      {!templatesEnabled && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Toggle on to define response formats for common interaction types.</div>}
      {templatesEnabled && templates.map((t, i) => (
        <Card key={i} highlight={selectedTemplates.has(i)} style={{ cursor: "pointer" }}>
          <div onClick={() => { const next = new Set(selectedTemplates); next.has(i) ? next.delete(i) : next.add(i); setSelectedTemplates(next); trackActivity(); }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              {selectedTemplates.has(i) ? <CheckCircle2 size={16} color="#d4a24e" /> : <Circle size={16} color="rgba(255,255,255,0.2)" />}
              <span style={{ fontWeight: 700, color: "#e0e0e0", fontSize: "14px" }}>{t.name}</span>
            </div>
            <div style={{ marginLeft: "26px" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "6px" }}>Trigger: {t.trigger}</div>
              <pre style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", margin: 0, whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.2)", padding: "8px 10px", borderRadius: "6px" }}>{t.format}</pre>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderExamples = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Approve Reference Examples</SectionLabel>
        <Btn small onClick={generateExamples} disabled={loading || !domain}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{examples.length ? "Regenerate" : "Generate"}</Btn>
      </div>
      {!examples.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Examples anchor Claude's behavior. Approve the ones that represent ideal responses.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {examples.map((e, i) => (
          <Card key={i} highlight={approvedExamples.has(i)} style={approvedExamples.has(i) ? { boxShadow: "0 0 20px rgba(212,162,78,0.15)", border: "1px solid rgba(212,162,78,0.4)", transition: "all 0.4s ease" } : { transition: "all 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.3)" }}>Example {i + 1}</span>
              <Btn small onClick={() => { const next = new Set(approvedExamples); next.has(i) ? next.delete(i) : next.add(i); setApprovedExamples(next); trackActivity(); }}>
                {approvedExamples.has(i) ? <><Check size={14} /> Approved</> : "Approve"}
              </Btn>
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "10px 12px", marginBottom: "8px" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>USER</div>
              <div style={{ color: "#e0e0e0", fontSize: "13px" }}>{e.userMessage}</div>
            </div>
            <div style={{ background: "rgba(212,162,78,0.05)", borderRadius: "6px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", color: "rgba(212,162,78,0.6)", marginBottom: "4px" }}>ASSISTANT</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: 1.5 }}>{e.idealResponse}</div>
            </div>
            {e.reasoning && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontStyle: "italic", marginTop: "8px" }}>{e.reasoning}</div>}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExport = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div>
            <SectionLabel>Project Description</SectionLabel>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", marginTop: "-10px", marginBottom: "10px" }}>Paste into "What are you trying to achieve?"</div>
          </div>
          <Btn small primary onClick={copyBlurb}>{copiedBlurb ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}</Btn>
        </div>
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px 18px" }}>
          <p style={{ color: "#e0e0e0", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{projectBlurb || "Fill in Project Context to generate this."}</p>
        </div>
      </div>
      <div>
        <SectionLabel>Additional Instructions</SectionLabel>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", marginTop: "-10px", marginBottom: "10px" }}>Anything the generator didn't cover</div>
        {!customInjection && compiledOutput.length > 100 && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(80,180,80,0.06)", border: "1px solid rgba(80,180,80,0.15)", borderRadius: "8px", marginBottom: "10px" }}>
            <CheckCircle2 size={16} color="#50b450" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>Looking good. Add anything specific below, or leave empty if the engine captured everything.</span>
          </div>
        )}
        <TextArea value={customInjection} onChange={v => { setCustomInjection(v); trackActivity(); }} placeholder="e.g. Always respond in English. Never use bullet points..." rows={4} />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div>
            <SectionLabel>Project Instructions</SectionLabel>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", marginTop: "-10px", marginBottom: "10px" }}>Paste into Custom Instructions in project settings</div>
          </div>
          <Btn small primary onClick={copyToClipboard}>{copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}</Btn>
        </div>
        <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", maxHeight: "420px", overflowY: "auto" }}>
          <pre style={{ color: "#e0e0e0", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{compiledOutput}</pre>
        </div>
      </div>
    </div>
  );

  const stepRenderers = [renderContext, renderIdentity, renderKnowledge, renderNegativeSpace, renderModes, renderPriority, renderFailure, renderTemplates, renderExamples, renderExport];

  const SECTION_LABELS = { context: "Project Context", identity: "Identity", knowledge: "Knowledge", negatives: "Negative Space", modes: "Modes", priorities: "Priorities", failures: "Failure Preemption", templates: "Templates", examples: "Examples" };

  const renderParsedPreview = () => {
    const r = parsedPreview;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: isMobile ? "16px" : "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <SectionLabel>Import Preview</SectionLabel>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "-10px", marginBottom: "16px" }}>Select which sections to import. Deselect anything that parsed incorrectly.</div>
          </div>
          <Btn small onClick={() => setParsedPreview(null)}><X size={14} /> Cancel</Btn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Object.entries(SECTION_LABELS).map(([key, label]) => {
            const hasContent = key === "context" ? (r.projectName || r.domain || r.description || r.goals) : key === "identity" ? r.identity?.title : r[key]?.length > 0;
            if (!hasContent) return null;
            const isSelected = selectedSections.has(key);
            return (
              <Card key={key} highlight={isSelected} style={{ cursor: "pointer" }}>
                <div onClick={() => { const next = new Set(selectedSections); next.has(key) ? next.delete(key) : next.add(key); setSelectedSections(next); }} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ marginTop: "2px", flexShrink: 0 }}>{isSelected ? <CheckCircle2 size={16} color="#d4a24e" /> : <Circle size={16} color="rgba(255,255,255,0.2)" />}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>{label}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
                      {key === "context" && `${r.projectName ? `Name: ${r.projectName}  ` : ""}${r.domain ? `Domain: ${r.domain}` : ""}`}
                      {key === "identity" && r.identity?.title}
                      {key === "modes" && r.modes?.map(m => m.name).join(", ")}
                      {["knowledge","negatives","priorities","failures","templates","examples"].includes(key) && `${r[key]?.length} item${r[key]?.length !== 1 ? "s" : ""}`}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <Btn primary onClick={applyParsed} disabled={selectedSections.size === 0}><Check size={16} /> Apply {selectedSections.size} Section{selectedSections.size !== 1 ? "s" : ""} & Open in Builder</Btn>
      </div>
    );
  };

  const renderEditMode = () => {
    if (parsedPreview) return renderParsedPreview();
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: isMobile ? "16px" : "30px" }}>
        <SectionLabel>Paste Existing Project Instructions</SectionLabel>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>Paste your current project instructions. Claude will extract each section so you can review and selectively import before anything is overwritten.</p>
        <TextArea value={pastedInstructions} onChange={setPastedInstructions} placeholder="Paste your project instructions here..." rows={12} />
        <Btn primary onClick={handleEditParse} disabled={loading || !pastedInstructions}>
          {loading ? <><Loader2 size={14} className="spin" /> Parsing...</> : <><Zap size={14} /> Decompose & Preview</>}
        </Btn>
      </div>
    );
  };

  const renderPreviewPanel = () => (
    <div style={isMobile ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)", display: showPreview ? "flex" : "none", flexDirection: "column" } : { width: showPreview ? "300px" : "0px", minWidth: showPreview ? "300px" : "0px", borderLeft: showPreview ? "1px solid rgba(255,255,255,0.06)" : "none", background: "rgba(0,0,0,0.15)", overflow: "hidden", transition: "all 0.3s", display: "flex", flexDirection: "column" }}>
      {showPreview && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#d4a24e", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>Live Preview</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.25)" }}>auto-updates</div>
              {isMobile && <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}><X size={18} color="rgba(255,255,255,0.5)" /></button>}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <pre style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{compiledOutput}</pre>
          </div>
          <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Btn small primary onClick={copyToClipboard} style={{ width: "100%", justifyContent: "center" }}>
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#111113", color: "#e0e0e0", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(212,162,78,0.1); } 50% { box-shadow: 0 0 20px rgba(212,162,78,0.3); } }
        @keyframes shimmerBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        @keyframes fadeInScale { 0% { opacity:0; transform:scale(0.5); } 50% { opacity:1; transform:scale(1.1); } 100% { opacity:1; transform:scale(1); } }
        .spin { animation: spin 1s linear infinite; }
        textarea:focus, input:focus { border-color: rgba(212,162,78,0.4) !important; }
        button:hover:not(:disabled) { opacity: 0.85; }
        @media (max-width: 767px) { textarea, input { font-size: 16px !important; } }
      `}</style>

      {error && <Toast msg={error} />}
      {showFireworks && <Fireworks />}

      {/* Header */}
      <div style={{ padding: isMobile ? "12px 16px" : "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "14px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #d4a24e, #b8862e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Zap size={18} color="#1a1a1a" /></div>
          <div>
            <div style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>Prompt Engine</div>
            {!isMobile && <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>Project Instructions Builder · {VERSION}</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Badge active={appMode === "create"} onClick={() => { setAppMode("create"); setParsedPreview(null); }}>Create</Badge>
          <Badge active={appMode === "edit"} onClick={() => setAppMode("edit")}>Edit</Badge>
          {!isMobile && <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />}
          <button onClick={() => setShowPreview(!showPreview)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
            {showPreview ? <PanelRightClose size={18} color="rgba(255,255,255,0.5)" /> : <PanelRightOpen size={18} color="rgba(255,255,255,0.5)" />}
            {!isMobile && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>Preview</span>}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: isMobile ? "column" : "row" }}>
        {appMode === "create" && (
          isMobile ? (
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.1)" }}>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ height: "100%", width: `${((step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(90deg, #d4a24e, #b8862e)", borderRadius: "0 2px 2px 0", transition: "width 0.3s ease" }} />
              </div>
              <button onClick={() => setShowMobileNav(!showMobileNav)} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                  {(() => { const Icon = STEPS[step].icon; return <Icon size={14} color="#d4a24e" />; })()}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0" }}>{STEPS[step].label}</span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace" }}>{step + 1}/{STEPS.length}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{STEPS[step].desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#d4a24e", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: "rgba(212,162,78,0.1)", border: "1px solid rgba(212,162,78,0.25)" }}>All Steps</span>
                  <ChevronRight size={14} color="#d4a24e" style={{ transform: showMobileNav ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </div>
              </button>
              {showMobileNav && (
                <div style={{ padding: "0 0 8px", maxHeight: "300px", overflowY: "auto", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  {STEPS.map((s, i) => {
                    const Icon = s.icon; const active = step === i; const completed = i < step;
                    return (
                      <button key={s.id} onClick={() => { setStep(i); setShowMobileNav(false); trackActivity(); }} style={{ width: "100%", padding: "10px 16px", background: active ? "rgba(212,162,78,0.08)" : "transparent", border: "none", borderLeft: active ? "3px solid #d4a24e" : "3px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <Icon size={14} color={active ? "#d4a24e" : completed ? "#50b450" : "rgba(255,255,255,0.2)"} />
                          {completed && <CheckCircle2 size={8} color="#50b450" style={{ position: "absolute", top: -3, right: -3 }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#e0e0e0" : "rgba(255,255,255,0.5)" }}>{s.label}</div>
                          <div style={{ fontSize: "10px", color: active ? "rgba(212,162,78,0.6)" : "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", marginTop: "1px" }}>{s.desc}</div>
                        </div>
                        {active && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d4a24e", flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: "220px", minWidth: "220px", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "16px 0", background: "rgba(0,0,0,0.1)", overflowY: "auto" }}>
              {STEPS.map((s, i) => {
                const Icon = s.icon; const active = step === i; const completed = i < step;
                return (
                  <button key={s.id} onClick={() => { setStep(i); trackActivity(); }} style={{ width: "100%", padding: "10px 16px", background: active ? "rgba(212,162,78,0.08)" : "transparent", border: "none", borderLeft: active ? "2px solid #d4a24e" : "2px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s", textAlign: "left" }}>
                    <Icon size={16} color={active ? "#d4a24e" : completed ? "#50b450" : "rgba(255,255,255,0.3)"} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#e0e0e0" : "rgba(255,255,255,0.5)" }}>{s.label}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        )}

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {appMode === "edit" ? renderEditMode() : (
            <div style={{ padding: isMobile ? "16px" : "24px 30px", flex: 1 }}>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.3)" }}>STEP {step + 1} / {STEPS.length}</span>
                <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", marginTop: "4px" }}>{STEPS[step].label}</h2>
              </div>
              {showAssist && step < 9 && (
                <div style={{ background: "rgba(212,162,78,0.08)", border: "1px solid rgba(212,162,78,0.25)", borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <Lightbulb size={18} color="#d4a24e" />
                  <span style={{ flex: 1, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Looks like you might be stuck. Want me to auto-generate this section?</span>
                  <Btn small primary onClick={autoFillCurrent}><Wand2 size={14} /> Auto-fill</Btn>
                </div>
              )}
              {loading && <LoadingIndicator />}
              {stepRenderers[step]()}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Btn onClick={() => { setStep(Math.max(0, step - 1)); trackActivity(); }} disabled={step === 0}><ChevronLeft size={16} /> Previous</Btn>
                {step < 9
                  ? <Btn primary onClick={() => { setStep(Math.min(9, step + 1)); trackActivity(); }} disabled={!canAdvance()}>Next <ChevronRight size={16} /></Btn>
                  : <Btn primary onClick={copyToClipboard}>{copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Instructions</>}</Btn>
                }
              </div>
            </div>
          )}
        </div>

        {renderPreviewPanel()}
      </div>
    </div>
  );
}