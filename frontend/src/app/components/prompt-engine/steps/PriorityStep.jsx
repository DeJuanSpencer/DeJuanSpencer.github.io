"use client";
import { useState } from "react";
import { Loader2, Sparkles, RefreshCw, Sliders, ArrowUp, ArrowDown } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

const INPUT_STYLE = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,162,78,0.4)", borderRadius: "4px", padding: "3px 8px", color: "#e0e0e0", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", width: "100%", outline: "none", resize: "vertical" };

export function PriorityStep({ loading, priorities, dragIdx, dragOverIdx, itemLoading, generatePriorities, regeneratePriority, handleDragStart, handleDragOver, handleDragEnd, movePriority, updatePriority, trackActivity }) {
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
    updatePriority(parseInt(idxStr), { [field]: editVal });
    setEditKey(null);
  };

  const cancelEdit = () => setEditKey(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") { e.preventDefault(); commitEdit(); }
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Priority Rules</SectionLabel>
        <Btn small onClick={generatePriorities} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{priorities.length ? "Regenerate All" : "Generate"}</Btn>
      </div>
      {!priorities.length && !loading && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Priority rules resolve conflicts when two instructions compete. Higher = wins.</div>}
      {priorities.length > 0 && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>Drag to reorder or use arrows. Higher position = higher priority.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} role="list" aria-label="Priority rules, ordered by importance">
        {priorities.map((p, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "grab", opacity: dragIdx === i ? 0.5 : 1, borderColor: dragOverIdx === i ? "rgba(212,162,78,0.5)" : undefined, transform: dragOverIdx === i ? "scale(1.02)" : "scale(1)", transition: "transform 0.2s, border-color 0.2s, opacity 0.2s" }}
            draggable onDragStart={() => handleDragStart(i)} onDragOver={e => handleDragOver(e, i)} onDragEnd={handleDragEnd}>
            <div role="listitem" style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
              <Sliders size={14} color="rgba(255,255,255,0.3)" style={{ cursor: "grab", marginRight: "4px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <button onClick={e => { e.stopPropagation(); movePriority(i, -1); }} aria-label={`Move "${p.rule}" up`} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", padding: "10px", lineHeight: 0, minWidth: "36px", minHeight: "36px", display: "flex", alignItems: "center", justifyContent: "center", opacity: i === 0 ? 0.3 : 1 }}><ArrowUp size={14} color="rgba(255,255,255,0.55)" /></button>
                <button onClick={e => { e.stopPropagation(); movePriority(i, 1); }} aria-label={`Move "${p.rule}" down`} disabled={i === priorities.length - 1} style={{ background: "none", border: "none", cursor: i === priorities.length - 1 ? "default" : "pointer", padding: "10px", lineHeight: 0, minWidth: "36px", minHeight: "36px", display: "flex", alignItems: "center", justifyContent: "center", opacity: i === priorities.length - 1 ? 0.3 : 1 }}><ArrowDown size={14} color="rgba(255,255,255,0.55)" /></button>
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#d4a24e", minWidth: "20px" }}>P{i + 1}</span>
            <div style={{ flex: 1 }}>
              {editKey === `${i}.rule` ? (
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
                  onClick={e => startEdit(`${i}.rule`, p.rule, e)}
                >{p.rule}</div>
              )}
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "2px", display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
                <span style={{ flexShrink: 0 }}>Overrides:</span>
                {editKey === `${i}.overrides` ? (
                  <input
                    type="text"
                    value={editVal}
                    autoFocus
                    style={{ ...INPUT_STYLE, fontSize: "12px", flex: 1, minWidth: "80px" }}
                    onChange={e => setEditVal(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span
                    style={{ cursor: "text" }}
                    title="Click to edit"
                    onClick={e => startEdit(`${i}.overrides`, p.overrides, e)}
                  >{p.overrides}</span>
                )}
                <span style={{ flexShrink: 0 }}>| Exception:</span>
                {editKey === `${i}.exception` ? (
                  <input
                    type="text"
                    value={editVal}
                    autoFocus
                    style={{ ...INPUT_STYLE, fontSize: "12px", flex: 1, minWidth: "80px" }}
                    onChange={e => setEditVal(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span
                    style={{ cursor: "text" }}
                    title="Click to edit"
                    onClick={e => startEdit(`${i}.exception`, p.exception, e)}
                  >{p.exception}</span>
                )}
              </div>
            </div>
            <Btn small onClick={() => regeneratePriority(i)} disabled={itemLoading[`priority_${i}`]}>{itemLoading[`priority_${i}`] ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />} Redo</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}
