"use client";
import { Loader2, Zap, Check, X, CheckCircle2, Circle } from "lucide-react";
import { Btn, TextArea, SectionLabel, Card } from "./ui";

const SECTION_LABELS = {
  context: "Project Context",
  identity: "Identity",
  knowledge: "Knowledge",
  negatives: "Guardrails",
  modes: "Modes",
  priorities: "Priorities",
  failures: "Failure Preemption",
  templates: "Templates",
  examples: "Examples",
};

export default function EditMode({ isMobile, loading, parsedPreview, pastedInstructions, setPastedInstructions, selectedSections, setSelectedSections, onParse, onApply, onCancel }) {
  if (parsedPreview) {
    const r = parsedPreview;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: isMobile ? "16px" : "32px 40px", maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <SectionLabel>Import Preview</SectionLabel>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "-10px", marginBottom: "16px" }}>Select which sections to import. Deselect anything that parsed incorrectly.</div>
          </div>
          <Btn small onClick={onCancel}><X size={14} /> Cancel</Btn>
        </div>
        <div role="group" aria-label="Sections to import" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Object.entries(SECTION_LABELS).map(([key, label]) => {
            const hasContent = key === "context" ? (r.projectName || r.domain || r.description || r.goals) : key === "identity" ? r.identity?.title : r[key]?.length > 0;
            if (!hasContent) return null;
            const isSelected = selectedSections.has(key);
            return (
              <Card key={key} highlight={isSelected} style={{ cursor: "pointer" }}>
                <div role="checkbox" aria-checked={isSelected} aria-label={label} tabIndex={0} onClick={() => { const next = new Set(selectedSections); next.has(key) ? next.delete(key) : next.add(key); setSelectedSections(next); }} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const next = new Set(selectedSections); next.has(key) ? next.delete(key) : next.add(key); setSelectedSections(next); } }} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ marginTop: "2px", flexShrink: 0 }}>{isSelected ? <CheckCircle2 size={16} color="#d4a24e" /> : <Circle size={16} color="rgba(255,255,255,0.3)" />}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>{label}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
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
        <Btn primary onClick={onApply} disabled={selectedSections.size === 0}><Check size={16} /> Apply {selectedSections.size} Section{selectedSections.size !== 1 ? "s" : ""} & Open in Builder</Btn>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: isMobile ? "16px" : "32px 40px", maxWidth: "640px", margin: "0 auto" }}>
      <SectionLabel>Paste Existing Project Instructions</SectionLabel>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>Paste your current project instructions. Claude will extract each section so you can review and selectively import before anything is overwritten.</p>
      <TextArea value={pastedInstructions} onChange={setPastedInstructions} placeholder="Paste your project instructions here..." rows={12} label="Existing project instructions" />
      <Btn primary onClick={onParse} disabled={loading || !pastedInstructions}>
        {loading ? <><Loader2 size={14} className="spin" /> Parsing...</> : <><Zap size={14} /> Analyze & Preview</>}
      </Btn>
    </div>
  );
}
