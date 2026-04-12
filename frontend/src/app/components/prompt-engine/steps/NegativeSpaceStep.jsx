"use client";
import { useState } from "react";
import { Loader2, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { SectionLabel, Btn, Card, StepExample } from "../ui";

const INPUT_STYLE = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,162,78,0.4)", borderRadius: "4px", padding: "3px 8px", color: "#e0e0e0", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", width: "100%", outline: "none", resize: "vertical" };

export function NegativeSpaceStep({ loading, negativeSuggestions, selectedNegatives, setSelectedNegatives, generateNegativeSpace, updateNegative, trackActivity }) {
  const [editKey, setEditKey] = useState(null);
  const [editVal, setEditVal] = useState("");

  const startEdit = (key, val, e) => {
    e?.stopPropagation();
    setEditKey(key);
    setEditVal(val);
  };

  const commitEdit = () => {
    if (editKey === null) return;
    const [idxStr, field] = editKey.split(".");
    updateNegative(parseInt(idxStr), { [field]: editVal });
    setEditKey(null);
  };

  const cancelEdit = () => setEditKey(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") { e.preventDefault(); commitEdit(); }
    if (e.key === "Escape") cancelEdit();
  };

  const handleTextareaKeyDown = (e) => {
    if (e.key === "Escape") cancelEdit();
  };

  const toggleSelect = (i) => {
    const next = new Set(selectedNegatives);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelectedNegatives(next);
    trackActivity();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <StepExample>
        For a coding assistant — "Do not suggest deprecated APIs without flagging them" or "Do not produce working exploit code even as a demonstration." These become permanent rules, not per-message requests.
      </StepExample>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel sub>Select Behaviors to Block</SectionLabel>
        <Btn small onClick={generateNegativeSpace} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{negativeSuggestions.length ? "Regenerate" : "Generate Guardrails"}</Btn>
      </div>
      {!negativeSuggestions.length && !loading && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Auto-generated based on your domain. Deselect any that don't apply to your project.</div>}
      {negativeSuggestions.length > 0 && selectedNegatives.size === negativeSuggestions.length && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(80,180,80,0.06)", border: "1px solid rgba(80,180,80,0.2)", borderRadius: "8px" }}>
          <CheckCircle2 size={16} color="#50b450" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>All behaviors selected by default. Deselect any that don't apply to your project.</span>
        </div>
      )}
      <div role="group" aria-label="Behaviors to block" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {negativeSuggestions.map((n, i) => (
          <Card key={i} highlight={selectedNegatives.has(i)} style={{ cursor: "pointer" }}>
            <div
              role="checkbox"
              aria-checked={selectedNegatives.has(i)}
              aria-label={n.behavior}
              tabIndex={0}
              onClick={() => { if (editKey === null) toggleSelect(i); }}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSelect(i); } }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                {selectedNegatives.has(i) ? <CheckCircle2 size={16} color="#d4a24e" style={{ marginTop: "2px", flexShrink: 0 }} /> : <Circle size={16} color="rgba(255,255,255,0.3)" style={{ marginTop: "2px", flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editKey === `${i}.behavior` ? (
                    <input
                      type="text"
                      value={editVal}
                      autoFocus
                      style={{ ...INPUT_STYLE, fontSize: "13px", fontWeight: 600 }}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={handleKeyDown}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600, cursor: "text" }}
                      title="Click to edit"
                      onClick={e => startEdit(`${i}.behavior`, n.behavior, e)}
                    >{n.behavior}</div>
                  )}
                  {editKey === `${i}.reason` ? (
                    <textarea
                      value={editVal}
                      autoFocus
                      rows={2}
                      style={{ ...INPUT_STYLE, fontSize: "12px", marginTop: "2px", display: "block" }}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={handleTextareaKeyDown}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "2px", cursor: "text" }}
                      title="Click to edit"
                      onClick={e => startEdit(`${i}.reason`, n.reason, e)}
                    >{n.reason}</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
