import {
  Layers, Target, Brain, ShieldOff,
  Sliders, ArrowUp, AlertTriangle, FileText, BookOpen, Download
} from "lucide-react";

export const VERSION = "v1.6";

export const STEPS = [
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

export const LOADING_PHRASES = [
  "Thinking...", "Analyzing your context...", "Mapping the domain...",
  "Constructing the framework...", "Calibrating precision...",
  "Shaping the architecture...", "Refining the output...", "Almost there...",
];

export function buildOutput({
  selectedIdentity, identityOptions, knowledgeResult,
  selectedNegatives, negativeSuggestions, modes, defaultModeIdx,
  priorities, failures, templatesEnabled, selectedTemplates,
  templates, approvedExamples, examples, customInjection,
}) {
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
}
