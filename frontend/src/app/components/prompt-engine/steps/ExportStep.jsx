"use client";
import { Loader2, Sparkles, Check, Copy, CheckCircle2 } from "lucide-react";
import { SectionLabel, Btn, TextArea } from "../ui";

export function ExportStep({ projectBlurb, compiledOutput, customInjection, setCustomInjection, copied, copiedBlurb, feedbackText, setFeedbackText, feedbackSubmitted, feedbackSending, onCopy, onCopyBlurb, onSubmitFeedback, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div>
            <SectionLabel>Step 1: Project Description</SectionLabel>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", marginTop: "-10px", marginBottom: "10px" }}>Copy this and paste it into <strong style={{ color: "rgba(255,255,255,0.8)" }}>"What are you trying to achieve?"</strong> in Claude project settings.</div>
          </div>
          <Btn small primary onClick={onCopyBlurb}>{copiedBlurb ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}</Btn>
        </div>
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px 18px" }}>
          <p style={{ color: "#e0e0e0", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{projectBlurb || "Fill in Project Context to generate this."}</p>
        </div>
      </div>
      <div>
        <SectionLabel>Additional Instructions</SectionLabel>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace", marginTop: "-10px", marginBottom: "10px" }}>Anything the generator didn't cover</div>
        {!customInjection && compiledOutput.length > 100 && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(80,180,80,0.06)", border: "1px solid rgba(80,180,80,0.15)", borderRadius: "8px", marginBottom: "10px" }}>
            <CheckCircle2 size={16} color="#50b450" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>Looking good. Add anything specific below, or leave empty if the engine captured everything.</span>
          </div>
        )}
        <TextArea value={customInjection} onChange={v => { setCustomInjection(v); trackActivity(); }} placeholder="e.g. Always respond in English. Never use bullet points..." rows={4} label="Additional custom instructions" />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div>
            <SectionLabel>Step 2: Project Instructions</SectionLabel>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", marginTop: "-10px", marginBottom: "10px" }}>Copy this and paste it into <strong style={{ color: "rgba(255,255,255,0.8)" }}>Custom Instructions</strong> in the same project settings page.</div>
          </div>
          <Btn small primary onClick={onCopy}>{copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}</Btn>
        </div>
        <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", maxHeight: "420px", overflowY: "auto" }}>
          <pre style={{ color: "#e0e0e0", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{compiledOutput}</pre>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px" }}>
        <SectionLabel>Feedback</SectionLabel>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace", marginTop: "-10px", marginBottom: "10px" }}>How was your experience? What would make this better?</div>
        {feedbackSubmitted ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 20px", background: "rgba(80,180,80,0.06)", border: "1px solid rgba(80,180,80,0.2)", borderRadius: "10px" }}>
            <CheckCircle2 size={18} color="#50b450" />
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#e0e0e0" }}>Thank you for your feedback!</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>Your input helps shape the future of Prompt Engine.</div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <TextArea value={feedbackText} onChange={setFeedbackText} placeholder="What worked well? What felt confusing? What features would you add?" rows={3} label="Feedback" />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Btn primary onClick={onSubmitFeedback} disabled={!feedbackText.trim() || feedbackSending}>
                {feedbackSending ? <><Loader2 size={14} className="spin" /> Sending...</> : <><Sparkles size={14} /> Submit Feedback</>}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
