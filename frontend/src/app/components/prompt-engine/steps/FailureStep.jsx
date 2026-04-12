"use client";
import { useState } from "react";
import { Loader2, Sparkles, RefreshCw, ShieldOff, AlertTriangle } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

const INPUT_STYLE = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,162,78,0.4)", borderRadius: "4px", padding: "3px 8px", color: "#e0e0e0", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", width: "100%", outline: "none", resize: "vertical" };

export function FailureStep({ loading, failures, itemLoading, generateFailures, regenerateFailure, updateFailure, trackActivity }) {
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
    updateFailure(parseInt(idxStr), { [field]: editVal });
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Failure Mode Preemption</SectionLabel>
        <Btn small onClick={generateFailures} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{failures.length ? "Regenerate All" : "Generate"}</Btn>
      </div>
      {!failures.length && !loading && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Domain-specific failure patterns Claude should be explicitly blocked from.</div>}
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
                {editKey === `${i}.pattern` ? (
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
                    onClick={e => startEdit(`${i}.pattern`, f.pattern, e)}
                  >{f.pattern}</div>
                )}
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "2px" }}>Severity: {f.severity}</div>
                <div style={{ color: "rgba(212,162,78,0.8)", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "flex-start", gap: "4px" }}>
                  <span style={{ flexShrink: 0 }}>Prevention:</span>
                  {editKey === `${i}.prevention` ? (
                    <textarea
                      value={editVal}
                      autoFocus
                      rows={2}
                      style={{ ...INPUT_STYLE, fontSize: "12px", color: "rgba(212,162,78,0.8)", flex: 1 }}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={handleTextareaKeyDown}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      style={{ cursor: "text" }}
                      title="Click to edit"
                      onClick={e => startEdit(`${i}.prevention`, f.prevention, e)}
                    >{f.prevention}</span>
                  )}
                </div>
              </div>
              <Btn small onClick={() => regenerateFailure(i)} disabled={itemLoading[`failure_${i}`]}>{itemLoading[`failure_${i}`] ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />} Redo</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
