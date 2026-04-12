"use client";
import { useState } from "react";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

const INPUT_STYLE = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,162,78,0.4)", borderRadius: "4px", padding: "3px 8px", color: "#e0e0e0", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", width: "100%", outline: "none", resize: "vertical" };

export function ModesStep({ loading, modes, defaultModeIdx, setDefaultModeIdx, itemLoading, generateModes, regenerateMode, updateMode, trackActivity }) {
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
    updateMode(parseInt(idxStr), { [field]: editVal });
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
        <SectionLabel>Operational Modes</SectionLabel>
        <Btn small onClick={generateModes} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{modes.length ? "Regenerate All" : "Generate Modes"}</Btn>
      </div>
      {!modes.length && !loading && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Modes give you switchable behavior profiles within the same project.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {modes.map((m, i) => (
          <Card key={i} highlight={i === defaultModeIdx}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  {editKey === `${i}.name` ? (
                    <input
                      type="text"
                      value={editVal}
                      autoFocus
                      style={{ ...INPUT_STYLE, fontWeight: 700, fontSize: "15px" }}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={handleKeyDown}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      style={{ fontWeight: 700, color: "#e0e0e0", fontSize: "15px", cursor: "text" }}
                      title="Click to edit"
                      onClick={e => startEdit(`${i}.name`, m.name, e)}
                    >{m.name}</span>
                  )}
                  {editKey === `${i}.trigger` ? (
                    <input
                      type="text"
                      value={editVal}
                      autoFocus
                      style={{ ...INPUT_STYLE, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", width: "auto", minWidth: "80px" }}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={handleKeyDown}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: "rgba(212,162,78,0.15)", color: "#d4a24e", fontFamily: "'JetBrains Mono', monospace", cursor: "text" }}
                      title="Click to edit"
                      onClick={e => startEdit(`${i}.trigger`, m.trigger, e)}
                    >"{m.trigger}"</span>
                  )}
                  {i === defaultModeIdx && <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(80,180,80,0.15)", color: "#50b450", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>default</span>}
                </div>
                {editKey === `${i}.description` ? (
                  <textarea
                    value={editVal}
                    autoFocus
                    rows={2}
                    style={{ ...INPUT_STYLE, fontSize: "13px", margin: "4px 0 8px", display: "block" }}
                    onChange={e => setEditVal(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleTextareaKeyDown}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <p
                    style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", margin: "4px 0 8px", cursor: "text" }}
                    title="Click to edit"
                    onClick={e => startEdit(`${i}.description`, m.description, e)}
                  >{m.description}</p>
                )}
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
}
