"use client";
import { Check, Copy, X } from "lucide-react";
import { Btn } from "./ui";

export default function PreviewPanel({ isMobile, showPreview, setShowPreview, compiledOutput, copied, onCopy }) {
  return (
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
            <Btn small primary onClick={onCopy} style={{ width: "100%", justifyContent: "center" }}>
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
