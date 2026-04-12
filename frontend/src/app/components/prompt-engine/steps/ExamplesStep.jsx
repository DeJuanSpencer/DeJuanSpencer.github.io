"use client";
import { useState } from "react";
import { Loader2, Sparkles, Check } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

const INPUT_STYLE = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,162,78,0.4)", borderRadius: "4px", padding: "3px 8px", color: "#e0e0e0", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", width: "100%", outline: "none", resize: "vertical" };

export function ExamplesStep({ loading, examples, approvedExamples, setApprovedExamples, generateExamples, updateExample, trackActivity }) {
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
    updateExample(parseInt(idxStr), { [field]: editVal });
    setEditKey(null);
  };

  const cancelEdit = () => setEditKey(null);

  const handleTextareaKeyDown = (e) => {
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Approve Reference Examples</SectionLabel>
        <Btn small onClick={generateExamples} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{examples.length ? "Regenerate" : "Generate"}</Btn>
      </div>
      {!examples.length && !loading && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Examples anchor Claude's behavior. Approve the ones that represent ideal responses.</div>}
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
              {editKey === `${i}.userMessage` ? (
                <textarea
                  value={editVal}
                  autoFocus
                  rows={3}
                  style={{ ...INPUT_STYLE, fontSize: "13px", background: "rgba(255,255,255,0.07)" }}
                  onChange={ev => setEditVal(ev.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleTextareaKeyDown}
                  onClick={ev => ev.stopPropagation()}
                />
              ) : (
                <div
                  style={{ color: "#e0e0e0", fontSize: "13px", cursor: "text" }}
                  title="Click to edit"
                  onClick={ev => startEdit(`${i}.userMessage`, e.userMessage, ev)}
                >{e.userMessage}</div>
              )}
            </div>
            <div style={{ background: "rgba(212,162,78,0.05)", borderRadius: "6px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", color: "rgba(212,162,78,0.6)", marginBottom: "4px" }}>ASSISTANT</div>
              {editKey === `${i}.idealResponse` ? (
                <textarea
                  value={editVal}
                  autoFocus
                  rows={4}
                  style={{ ...INPUT_STYLE, fontSize: "13px", lineHeight: "1.5", background: "rgba(212,162,78,0.07)", color: "rgba(255,255,255,0.8)" }}
                  onChange={ev => setEditVal(ev.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleTextareaKeyDown}
                  onClick={ev => ev.stopPropagation()}
                />
              ) : (
                <div
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: 1.5, cursor: "text" }}
                  title="Click to edit"
                  onClick={ev => startEdit(`${i}.idealResponse`, e.idealResponse, ev)}
                >{e.idealResponse}</div>
              )}
            </div>
            {e.reasoning && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", fontStyle: "italic", marginTop: "8px" }}>{e.reasoning}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
