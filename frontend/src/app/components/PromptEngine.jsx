"use client";
import { Fragment, useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Zap, PanelRightOpen, PanelRightClose, X, Lightbulb, Wand2, Check, Copy, CheckCircle2, LogOut, Loader2 } from "lucide-react";
import { usePromptEngine } from "../hooks/usePromptEngine";
import { useAuth } from "../hooks/useAuth";
import { STEPS, VERSION } from "../lib/outputBuilder";
import { getSupabaseClient } from "../lib/supabase/client";
import { Toast, Fireworks, Btn, Badge, LoadingIndicator } from "./prompt-engine/ui";
import { ContextStep } from "./prompt-engine/steps/ContextStep";
import { IdentityStep } from "./prompt-engine/steps/IdentityStep";
import { KnowledgeStep } from "./prompt-engine/steps/KnowledgeStep";
import { NegativeSpaceStep } from "./prompt-engine/steps/NegativeSpaceStep";
import { ModesStep } from "./prompt-engine/steps/ModesStep";
import { PriorityStep } from "./prompt-engine/steps/PriorityStep";
import { FailureStep } from "./prompt-engine/steps/FailureStep";
import { TemplatesStep } from "./prompt-engine/steps/TemplatesStep";
import { ExamplesStep } from "./prompt-engine/steps/ExamplesStep";
import { ExportStep } from "./prompt-engine/steps/ExportStep";
import PreviewPanel from "./prompt-engine/PreviewPanel";
import EditMode from "./prompt-engine/EditMode";
import SignInGate from "./prompt-engine/SignInGate";

const FREE_LIMIT = 50;

const STEP_COMPONENTS = [ContextStep, IdentityStep, KnowledgeStep, NegativeSpaceStep, ModesStep, PriorityStep, FailureStep, TemplatesStep, ExamplesStep, ExportStep];

export default function PromptEngine() {
  const auth = useAuth();
  const pe = usePromptEngine(auth.user);

  // Usage counter
  const [usageCount, setUsageCount] = useState(null);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (!auth.user) return;
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
        const { count } = await supabase
          .from("usage_events")
          .select("*", { count: "exact", head: true })
          .eq("user_id", auth.user.id)
          .gte("created_at", start.toISOString());
        setUsageCount(count ?? 0);
      } catch {}
    })();
  }, [auth.user]);

  // Increment local counter when a generation completes
  useEffect(() => {
    if (prevLoadingRef.current && !pe.loading && usageCount !== null) {
      setUsageCount(c => c + 1);
    }
    prevLoadingRef.current = pe.loading;
  }, [pe.loading]);

  // Step transition animation
  const [stepEntering, setStepEntering] = useState(false);
  const prevStepRef = useRef(pe.step);
  useEffect(() => {
    if (prevStepRef.current !== pe.step) {
      setStepEntering(true);
      const t = setTimeout(() => setStepEntering(false), 220);
      prevStepRef.current = pe.step;
      return () => clearTimeout(t);
    }
  }, [pe.step]);

  const stepProps = [
    { projectName: pe.projectName, setProjectName: pe.setProjectName, domain: pe.domain, setDomain: pe.setDomain, projectDesc: pe.projectDesc, setProjectDesc: pe.setProjectDesc, goals: pe.goals, setGoals: pe.setGoals, refineSuggestions: pe.refineSuggestions, generateLoading: pe.generateLoading, refineLoading: pe.refineLoading, generateField: pe.generateField, refineField: pe.refineField, acceptRefinement: pe.acceptRefinement, dismissRefinement: pe.dismissRefinement, trackActivity: pe.trackActivity },
    { loading: pe.loading, identityOptions: pe.identityOptions, selectedIdentity: pe.selectedIdentity, setSelectedIdentity: pe.setSelectedIdentity, generateIdentities: pe.generateIdentities, updateIdentityOption: pe.updateIdentityOption, trackActivity: pe.trackActivity },
    { loading: pe.loading, quizQuestions: pe.quizQuestions, quizAnswers: pe.quizAnswers, setQuizAnswers: pe.setQuizAnswers, knowledgeResult: pe.knowledgeResult, generateQuiz: pe.generateQuiz, processQuizAnswers: pe.processQuizAnswers, trackActivity: pe.trackActivity },
    { loading: pe.loading, negativeSuggestions: pe.negativeSuggestions, selectedNegatives: pe.selectedNegatives, setSelectedNegatives: pe.setSelectedNegatives, generateNegativeSpace: pe.generateNegativeSpace, updateNegative: pe.updateNegative, trackActivity: pe.trackActivity },
    { loading: pe.loading, modes: pe.modes, defaultModeIdx: pe.defaultModeIdx, setDefaultModeIdx: pe.setDefaultModeIdx, itemLoading: pe.itemLoading, generateModes: pe.generateModes, regenerateMode: pe.regenerateMode, updateMode: pe.updateMode, trackActivity: pe.trackActivity },
    { loading: pe.loading, priorities: pe.priorities, dragIdx: pe.dragIdx, dragOverIdx: pe.dragOverIdx, itemLoading: pe.itemLoading, generatePriorities: pe.generatePriorities, regeneratePriority: pe.regeneratePriority, handleDragStart: pe.handleDragStart, handleDragOver: pe.handleDragOver, handleDragEnd: pe.handleDragEnd, movePriority: pe.movePriority, updatePriority: pe.updatePriority, trackActivity: pe.trackActivity },
    { loading: pe.loading, failures: pe.failures, itemLoading: pe.itemLoading, generateFailures: pe.generateFailures, regenerateFailure: pe.regenerateFailure, updateFailure: pe.updateFailure, trackActivity: pe.trackActivity },
    { loading: pe.loading, templates: pe.templates, templatesEnabled: pe.templatesEnabled, setTemplatesEnabled: pe.setTemplatesEnabled, selectedTemplates: pe.selectedTemplates, setSelectedTemplates: pe.setSelectedTemplates, generateTemplates: pe.generateTemplates, trackActivity: pe.trackActivity },
    { loading: pe.loading, examples: pe.examples, approvedExamples: pe.approvedExamples, setApprovedExamples: pe.setApprovedExamples, generateExamples: pe.generateExamples, updateExample: pe.updateExample, trackActivity: pe.trackActivity },
    { projectBlurb: pe.projectBlurb, compiledOutput: pe.compiledOutput, customInjection: pe.customInjection, setCustomInjection: pe.setCustomInjection, copied: pe.copied, copiedBlurb: pe.copiedBlurb, feedbackText: pe.feedbackText, setFeedbackText: pe.setFeedbackText, feedbackSubmitted: pe.feedbackSubmitted, feedbackSending: pe.feedbackSending, onCopy: pe.copyToClipboard, onCopyBlurb: pe.copyBlurb, onSubmitFeedback: pe.submitFeedback, trackActivity: pe.trackActivity },
  ];

  const CurrentStep = STEP_COMPONENTS[pe.step];

  // Usage display helpers
  const usageAtRisk = usageCount !== null && usageCount >= FREE_LIMIT * 0.8;
  const usageHit = usageCount !== null && usageCount >= FREE_LIMIT;

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
        @keyframes gateFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flipHint { 0%,100% { transform: rotateY(0deg); } 50% { transform: rotateY(12deg); } }
        @keyframes stepEnter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .spin { animation: spin 1s linear infinite; }
        .gate-fade { animation: gateFade 0.6s ease forwards; }
        .gate-fade-2 { animation: gateFade 0.6s 0.15s ease forwards; opacity: 0; }
        .gate-fade-3 { animation: gateFade 0.6s 0.3s ease forwards; opacity: 0; }
        .step-enter { animation: stepEnter 0.22s ease-out both; }
        textarea:focus, input:focus { border-color: rgba(212,162,78,0.4) !important; }
        button:focus-visible, [tabindex]:focus-visible, a:focus-visible { outline: 2px solid #d4a24e; outline-offset: 2px; }
        button:hover:not(:disabled) { opacity: 0.85; }
        .flip-card { perspective: 800px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .flip-card-inner:not(.flipped) { animation: flipHint 2s 1.5s ease-in-out 1; }
        .flip-card-inner.flipped { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; top: 0; left: 0; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 12px; box-sizing: border-box; overflow: hidden; }
        .flip-card-back { transform: rotateY(180deg); }
        @media (max-width: 767px) { textarea, input { font-size: 16px !important; } }
        .stepper-node:hover .stepper-tooltip { opacity: 1; pointer-events: none; }
      `}</style>

      {pe.error && <Toast msg={pe.error} />}
      {pe.showFireworks && <Fireworks />}

      {auth.loading || (auth.user && pe.hydrating) ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={32} color="#d4a24e" className="spin" />
        </div>
      ) : !auth.user ? (
        <SignInGate isMobile={pe.isMobile} signInWithMagicLink={auth.signInWithMagicLink} />
      ) : (
        <>
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <header style={{ padding: pe.isMobile ? "12px 16px" : "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)", flexWrap: "wrap", gap: "8px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: pe.isMobile ? "10px" : "14px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #d4a24e, #b8862e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Zap size={18} color="#1a1a1a" /></div>
              <div>
                <h1 style={{ fontSize: pe.isMobile ? "14px" : "16px", fontWeight: 700, letterSpacing: "-0.3px", margin: 0 }}>Prompt Engine</h1>
                {!pe.isMobile && <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>Project Instructions Builder · {VERSION}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {/* Usage counter */}
              {usageCount !== null && !pe.isMobile && (
                <div title={usageHit ? "Monthly limit reached — upgrade for unlimited" : `${FREE_LIMIT - usageCount} calls remaining this month`} style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: usageHit ? "#dc5050" : usageAtRisk ? "#d4a24e" : "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: `1px solid ${usageHit ? "rgba(220,80,80,0.3)" : usageAtRisk ? "rgba(212,162,78,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: "6px", padding: "4px 10px", cursor: "default", transition: "all 0.2s" }}>
                  {usageCount} / {FREE_LIMIT}
                </div>
              )}

              <Badge active={pe.appMode === "create"} onClick={() => { pe.setAppMode("create"); pe.setParsedPreview(null); }}>Create</Badge>
              <Badge active={pe.appMode === "edit"} onClick={() => pe.setAppMode("edit")}>Edit</Badge>
              {!pe.isMobile && <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />}
              <button onClick={() => pe.setShowPreview(!pe.showPreview)} aria-label={pe.showPreview ? "Hide preview panel" : "Show preview panel"} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                {pe.showPreview ? <PanelRightClose size={18} color="rgba(255,255,255,0.6)" /> : <PanelRightOpen size={18} color="rgba(255,255,255,0.6)" />}
                {!pe.isMobile && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>Preview</span>}
              </button>
              <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />
              <button onClick={auth.signOut} title={`Sign out${auth.user?.email ? ` (${auth.user.email})` : ""}`} aria-label="Sign out" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                <LogOut size={16} color="rgba(255,255,255,0.55)" />
                {!pe.isMobile && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>Sign out</span>}
              </button>
              <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />
              <a href="/" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }} title="Back to site" aria-label="Back to site">
                <X size={18} color="rgba(255,255,255,0.55)" />
              </a>
            </div>
          </header>

          {/* ── Horizontal Stepper (desktop, create mode) ──────────────────── */}
          {!pe.isMobile && pe.appMode === "create" && (
            <div role="navigation" aria-label="Steps" style={{ display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.12)", height: "56px", flexShrink: 0, overflowX: "auto" }}>
              {STEPS.map((s, i) => {
                const active = pe.step === i;
                const completed = i < pe.step;
                const Icon = s.icon;
                return (
                  <Fragment key={s.id}>
                    {i > 0 && (
                      <div style={{ flex: 1, height: "1px", minWidth: "10px", maxWidth: "48px", background: completed ? "rgba(212,162,78,0.45)" : "rgba(255,255,255,0.08)", transition: "background 0.3s", flexShrink: 0 }} />
                    )}
                    <button
                      className="stepper-node"
                      onClick={() => { if (i <= pe.step) { pe.setStep(i); pe.trackActivity(); } }}
                      disabled={i > pe.step}
                      aria-current={active ? "step" : undefined}
                      title={i > pe.step ? "Complete the current step first" : undefined}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: i > pe.step ? "not-allowed" : active ? "default" : "pointer", padding: "4px 6px", position: "relative", flexShrink: 0, opacity: i > pe.step ? 0.38 : 1, transition: "opacity 0.2s" }}
                    >
                      {/* Circle */}
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: active ? "#d4a24e" : completed ? "rgba(212,162,78,0.12)" : "rgba(255,255,255,0.05)", border: active ? "none" : completed ? "1.5px solid rgba(212,162,78,0.55)" : "1.5px solid rgba(255,255,255,0.14)", transition: "all 0.2s", flexShrink: 0 }}>
                        {completed
                          ? <Check size={12} color="#d4a24e" />
                          : <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: active ? "#1a1a1a" : "rgba(255,255,255,0.3)", lineHeight: 1 }}>{i + 1}</span>
                        }
                      </div>
                      {/* Label — first word only to stay compact */}
                      <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: active ? "#d4a24e" : completed ? "rgba(212,162,78,0.5)" : "rgba(255,255,255,0.25)", fontWeight: active ? 600 : 400, letterSpacing: "0.2px", whiteSpace: "nowrap", lineHeight: 1 }}>
                        {s.label.split(" ")[0]}
                      </span>
                      {/* Tooltip — full step name on hover */}
                      <div className="stepper-tooltip" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "rgba(30,30,34,0.96)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "5px 9px", fontSize: "11px", color: "#e0e0e0", whiteSpace: "nowrap", opacity: 0, transition: "opacity 0.15s", pointerEvents: "none", zIndex: 10, fontFamily: "'DM Sans', sans-serif" }}>
                        {s.label}
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", marginTop: "1px" }}>{s.desc}</div>
                      </div>
                    </button>
                  </Fragment>
                );
              })}
            </div>
          )}

          {/* ── Mobile nav (unchanged) ──────────────────────────────────────── */}
          {pe.isMobile && pe.appMode === "create" && (
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.1)", flexShrink: 0 }}>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.04)" }} role="progressbar" aria-valuenow={pe.step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${pe.step + 1} of ${STEPS.length}`}>
                <div style={{ height: "100%", width: `${((pe.step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(90deg, #d4a24e, #b8862e)", borderRadius: "0 2px 2px 0", transition: "width 0.3s ease" }} />
              </div>
              <button onClick={() => pe.setShowMobileNav(!pe.showMobileNav)} aria-expanded={pe.showMobileNav} aria-label="Toggle step navigation" style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                  {(() => { const Icon = STEPS[pe.step].icon; return <Icon size={14} color="#d4a24e" />; })()}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0" }}>{STEPS[pe.step].label}</span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>{pe.step + 1}/{STEPS.length}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{STEPS[pe.step].desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#d4a24e", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: "rgba(212,162,78,0.1)", border: "1px solid rgba(212,162,78,0.25)" }}>All Steps</span>
                  <ChevronRight size={14} color="#d4a24e" style={{ transform: pe.showMobileNav ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </div>
              </button>
              {pe.showMobileNav && (
                <nav aria-label="Steps" style={{ padding: "0 0 8px", maxHeight: "300px", overflowY: "auto", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  {STEPS.map((s, i) => {
                    const Icon = s.icon; const active = pe.step === i; const completed = i < pe.step;
                    return (
                      <button key={s.id} onClick={() => { if (i <= pe.step) { pe.setStep(i); pe.setShowMobileNav(false); pe.trackActivity(); } }} disabled={i > pe.step} aria-current={active ? "step" : undefined} style={{ width: "100%", padding: "10px 16px", background: active ? "rgba(212,162,78,0.08)" : "transparent", border: "none", borderLeft: active ? "3px solid #d4a24e" : "3px solid transparent", cursor: i > pe.step ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", opacity: i > pe.step ? 0.4 : 1 }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <Icon size={14} color={active ? "#d4a24e" : completed ? "#50b450" : "rgba(255,255,255,0.3)"} />
                          {completed && <CheckCircle2 size={8} color="#50b450" style={{ position: "absolute", top: -3, right: -3 }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#e0e0e0" : "rgba(255,255,255,0.6)" }}>{s.label}</div>
                          <div style={{ fontSize: "10px", color: active ? "rgba(212,162,78,0.7)" : "rgba(255,255,255,0.45)", fontFamily: "'JetBrains Mono', monospace", marginTop: "1px" }}>{s.desc}</div>
                        </div>
                        {active && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d4a24e", flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          )}

          {/* ── Body ───────────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {pe.appMode === "edit" ? (
                <EditMode
                  isMobile={pe.isMobile}
                  loading={pe.loading}
                  parsedPreview={pe.parsedPreview}
                  pastedInstructions={pe.pastedInstructions}
                  setPastedInstructions={pe.setPastedInstructions}
                  selectedSections={pe.selectedSections}
                  setSelectedSections={pe.setSelectedSections}
                  onParse={pe.handleEditParse}
                  onApply={pe.applyParsed}
                  onCancel={() => pe.setParsedPreview(null)}
                />
              ) : (
                <div style={{ padding: pe.isMobile ? "16px" : "32px 40px", flex: 1, maxWidth: "680px", width: "100%", margin: "0 auto" }}>
                  {/* Step header */}
                  <div style={{ marginBottom: "24px" }}>
                    <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.4)" }}>STEP {pe.step + 1} / {STEPS.length}</span>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", marginTop: "4px" }}>{STEPS[pe.step].label}</h2>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "6px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{STEPS[pe.step].desc}</p>
                  </div>

                  {/* Idle assist nudge */}
                  {pe.showAssist && pe.step < 9 && (
                    <div style={{ background: "rgba(212,162,78,0.08)", border: "1px solid rgba(212,162,78,0.25)", borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <Lightbulb size={18} color="#d4a24e" />
                      <span style={{ flex: 1, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Looks like you might be stuck. Want me to auto-generate this section?</span>
                      <Btn small primary onClick={pe.autoFillCurrent}><Wand2 size={14} /> Auto-fill</Btn>
                    </div>
                  )}

                  {/* Usage warning banner */}
                  {usageAtRisk && !usageHit && (
                    <div style={{ background: "rgba(212,162,78,0.06)", border: "1px solid rgba(212,162,78,0.2)", borderRadius: "8px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", fontSize: "12px", color: "rgba(212,162,78,0.85)" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{FREE_LIMIT - usageCount} calls left</span>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>this month on the free plan.</span>
                    </div>
                  )}
                  {usageHit && (
                    <div style={{ background: "rgba(220,80,80,0.06)", border: "1px solid rgba(220,80,80,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "rgba(220,150,150,0.9)" }}>
                      Monthly limit reached. AI generation is paused until next month.
                    </div>
                  )}

                  {pe.loading && <LoadingIndicator />}

                  {/* Step content — fade-in on step change */}
                  <div className={stepEntering ? "step-enter" : ""}>
                    <CurrentStep {...stepProps[pe.step]} />
                  </div>

                  {/* Navigation */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Btn onClick={() => { pe.setStep(Math.max(0, pe.step - 1)); pe.trackActivity(); }} disabled={pe.step === 0}>
                      <ChevronLeft size={16} /> Previous
                    </Btn>
                    {pe.step < 9
                      ? <Btn primary onClick={() => { pe.setStep(Math.min(9, pe.step + 1)); pe.trackActivity(); }} disabled={!pe.canAdvance()}>
                          Next <ChevronRight size={16} />
                        </Btn>
                      : <Btn primary onClick={pe.copyToClipboard}>
                          {pe.copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Instructions</>}
                        </Btn>
                    }
                  </div>
                </div>
              )}
            </main>

            <PreviewPanel
              isMobile={pe.isMobile}
              showPreview={pe.showPreview}
              setShowPreview={pe.setShowPreview}
              compiledOutput={pe.compiledOutput}
              copied={pe.copied}
              onCopy={pe.copyToClipboard}
              currentStep={pe.step}
            />
          </div>
        </>
      )}
    </div>
  );
}
