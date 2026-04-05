"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EMAILJS_SERVICE_ID = "service_6bblsfd";
const EMAILJS_TEMPLATE_ID = "template_y5185ka";
const EMAILJS_PUBLIC_KEY = "gOPO4EaCND8y0uBjl";

const GOAL_OPTIONS = [
  "Sell products or services online",
  "Book appointments or reservations",
  "Showcase my work or portfolio",
  "Generate leads or collect inquiries",
  "Provide information about my business",
  "Build an internal tool for my team",
  "Other",
];

const TYPE_OPTIONS = [
  { label: "Website", desc: "A site people visit in their browser" },
  { label: "Mobile App", desc: "An app on phones (iOS / Android)" },
  { label: "Web Application", desc: "An interactive tool (dashboard, portal, etc.)" },
  { label: "Not sure yet", desc: "We'll figure it out together" },
];

const TIMELINE_OPTIONS = ["ASAP", "1–3 months", "3–6 months", "No rush — still exploring"];
const BUDGET_OPTIONS = ["Under $5,000", "$5,000 – $15,000", "$15,000 – $30,000", "$30,000+", "Not sure yet"];

const blankForm = {
  name: "", business: "", description: "", type: [] as string[], goals: [] as string[], goalOther: "",
  existingUrl: "", inspiration: "", timeline: "", budget: "",
  email: "", phone: "", notes: "",
};

type FormState = typeof blankForm;

function Field({ label, required, hint, mt, children }: { label: string; required?: boolean; hint?: string; mt?: number; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: mt || 18 }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", marginBottom: "6px" }}>
        {label}{required && <span style={{ color: "var(--brand-gold)", fontWeight: 400 }}> *</span>}
      </label>
      {hint && <p style={{ fontSize: "12.5px", color: "var(--text-tertiary)", margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif" }}>{hint}</p>}
      {children}
    </div>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVis(true)); }, []);
  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", fontSize: "15px",
  fontFamily: "'DM Sans', sans-serif",
  border: "1px solid var(--border-medium)", borderRadius: "10px",
  outline: "none", boxSizing: "border-box",
  color: "var(--text-primary)", background: "rgba(255,255,255,0.04)",
  transition: "border-color 0.2s",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle, resize: "vertical" as const,
};

const chipBase: React.CSSProperties = {
  padding: "8px 16px", fontSize: "13px",
  fontFamily: "'DM Sans', sans-serif",
  border: "1.5px solid var(--border-medium)", borderRadius: "24px",
  background: "rgba(255,255,255,0.03)", cursor: "pointer",
  color: "var(--text-secondary)", transition: "all 0.15s ease", lineHeight: 1.3,
};

const chipOn: React.CSSProperties = {
  borderColor: "var(--brand-gold)", background: "var(--brand-gold-muted)",
  color: "var(--brand-gold)", fontWeight: 600,
  boxShadow: "0 0 0 1px var(--brand-gold)",
};

const cardBase: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "flex-start",
  padding: "14px", border: "1.5px solid var(--border-medium)",
  borderRadius: "10px", background: "rgba(255,255,255,0.03)", cursor: "pointer",
  textAlign: "left", transition: "all 0.15s ease",
};

const cardOn: React.CSSProperties = {
  borderColor: "var(--brand-gold)", background: "var(--brand-gold-muted)",
  boxShadow: "0 0 0 1px var(--brand-gold)",
};

export default function WorkWithMePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ ...blankForm });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const update = (key: keyof FormState, val: string) => setForm(p => ({ ...p, [key]: val }));
  const toggleArr = (key: "type" | "goals", val: string) =>
    setForm(p => ({ ...p, [key]: (p[key] as string[]).includes(val) ? (p[key] as string[]).filter(v => v !== val) : [...(p[key] as string[]), val] }));

  const canAdvance = () => {
    if (step === 0) return true;
    if (step === 1) return form.name.trim() && form.business.trim();
    if (step === 2) return form.type.length > 0 && form.goals.length > 0;
    if (step === 3) return form.timeline && form.budget;
    if (step === 4) return form.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    return true;
  };

  const next = () => { if (step < 5 && canAdvance()) setStep(step + 1); };
  const back = () => { if (step > 0) setStep(step - 1); };

  const buildMessage = () => {
    const lines = [
      `New project inquiry received on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}.`,
      ``,
      `-- CLIENT --`,
      `Name: ${form.name}`,
      `Business: ${form.business}`,
      form.description ? `About: ${form.description}` : null,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
      ``,
      `-- PROJECT --`,
      `Type: ${form.type.join(", ")}`,
      `Goals: ${form.goals.join(", ")}${form.goalOther ? ` -- ${form.goalOther}` : ""}`,
      form.existingUrl ? `Existing site: ${form.existingUrl}` : null,
      form.inspiration ? `Inspiration: ${form.inspiration}` : null,
      ``,
      `-- LOGISTICS --`,
      `Timeline: ${form.timeline}`,
      `Budget: ${form.budget}`,
      form.notes ? `\n-- ADDITIONAL NOTES --\n${form.notes}` : null,
    ];
    return lines.filter(l => l !== null).join("\n");
  };

  const sendEmail = async () => {
    setSending(true);
    setSendError(null);
    const templateParams = {
      subject: `New Inquiry: ${form.business} -- ${form.name}`,
      message: buildMessage(),
      from_name: form.name,
      from_email: form.email,
      business_name: form.business,
    };
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: templateParams,
        }),
      });
      if (!res.ok) { const errText = await res.text(); throw new Error(errText || "Email send failed"); }
      setSent(true); setStep(5);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("EmailJS error:", message);
      setSendError("Something went wrong. Please try again or reach out directly.");
    } finally { setSending(false); }
  };

  const resetForm = () => { setForm({ ...blankForm }); setSent(false); setSendError(null); setStep(0); };

  const progress = Math.min((step / 5) * 100, 100);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--brand-foundation)", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)" }}>
      <Header />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 16px 24px" }}>
        <div style={{
          width: "100%", maxWidth: 540, background: "var(--brand-surface)",
          borderRadius: 14, border: "1px solid var(--border-subtle)",
          padding: "0 36px 36px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2), 0 0.5px 1px rgba(0,0,0,0.15)",
        }}>
          {/* Progress bar */}
          <div style={{ height: 2, background: "rgba(255,255,255,0.06)", margin: "0 -36px 28px", borderRadius: "14px 14px 0 0", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--brand-gold)", transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", width: `${progress}%` }} />
          </div>

          {step > 0 && step < 5 && (
            <div style={{ display: "inline-block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Step {step} of 4
            </div>
          )}

          {/* Step 0: Welcome */}
          {step === 0 && (
            <Fade key="s0">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 12, color: "var(--brand-gold)" }}>✦</div>
                <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--text-primary)" }}>
                  Let&apos;s Build Something Great
                </h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 28px" }}>
                  A few quick questions about your project so I can come prepared with the right plan. Takes about 2 minutes.
                </p>
                <button onClick={next} style={{
                  padding: "12px 30px", fontSize: "14.5px", fontWeight: 500,
                  background: "linear-gradient(135deg, var(--brand-gold), #a8862e)",
                  color: "var(--brand-foundation)", border: "none", borderRadius: 8, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Get Started</button>
              </div>
            </Fade>
          )}

          {/* Step 1: About You */}
          {step === 1 && (
            <Fade key="s1">
              <h2 style={{ fontSize: 21, fontWeight: 600, margin: "0 0 4px", color: "var(--text-primary)" }}>About You</h2>
              <Field label="Your Name" required>
                <input style={inputStyle} value={form.name} onChange={e => update("name", e.target.value)} placeholder="Jane Smith" />
              </Field>
              <Field label="Business Name" required>
                <input style={inputStyle} value={form.business} onChange={e => update("business", e.target.value)} placeholder="Acme Co." />
              </Field>
              <Field label="What does your business do?">
                <textarea style={textareaStyle} value={form.description} onChange={e => update("description", e.target.value)}
                  placeholder="In a sentence or two, what do you sell or offer?" rows={3} />
              </Field>
            </Fade>
          )}

          {/* Step 2: Project */}
          {step === 2 && (
            <Fade key="s2">
              <h2 style={{ fontSize: 21, fontWeight: 600, margin: "0 0 4px", color: "var(--text-primary)" }}>Your Project</h2>
              <Field label="What do you need built?" required hint="Select all that apply">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {TYPE_OPTIONS.map(t => (
                    <button key={t.label}
                      style={{ ...cardBase, ...(form.type.includes(t.label) ? cardOn : {}) }}
                      onClick={() => toggleArr("type", t.label)}>
                      <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>{t.label}</span>
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.4 }}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="What's the primary goal?" required hint="Select all that apply" mt={28}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {GOAL_OPTIONS.map(g => (
                    <button key={g}
                      style={{ ...chipBase, ...(form.goals.includes(g) ? chipOn : {}) }}
                      onClick={() => toggleArr("goals", g)}>
                      {g}
                    </button>
                  ))}
                </div>
                {form.goals.includes("Other") && (
                  <input style={{ ...inputStyle, marginTop: 10 }} value={form.goalOther}
                    onChange={e => update("goalOther", e.target.value)} placeholder="Tell me more..." />
                )}
              </Field>
            </Fade>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <Fade key="s3">
              <h2 style={{ fontSize: 21, fontWeight: 600, margin: "0 0 4px", color: "var(--text-primary)" }}>A Few More Details</h2>
              <Field label="Do you have an existing website?">
                <input style={inputStyle} value={form.existingUrl} onChange={e => update("existingUrl", e.target.value)} placeholder="https://example.com" />
              </Field>
              <Field label="Any websites or apps you admire?">
                <input style={inputStyle} value={form.inspiration} onChange={e => update("inspiration", e.target.value)}
                  placeholder="Links or names, helps me understand your taste" />
              </Field>
              <Field label="Timeline" required mt={24}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TIMELINE_OPTIONS.map(t => (
                    <button key={t} style={{ ...chipBase, ...(form.timeline === t ? chipOn : {}) }}
                      onClick={() => update("timeline", t)}>{t}</button>
                  ))}
                </div>
              </Field>
              <Field label="Budget Range" required mt={24}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {BUDGET_OPTIONS.map(b => (
                    <button key={b} style={{ ...chipBase, ...(form.budget === b ? chipOn : {}) }}
                      onClick={() => update("budget", b)}>{b}</button>
                  ))}
                </div>
              </Field>
            </Fade>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <Fade key="s4">
              <h2 style={{ fontSize: 21, fontWeight: 600, margin: "0 0 4px", color: "var(--text-primary)" }}>How Can I Reach You?</h2>
              <Field label="Email" required>
                <input style={inputStyle} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" />
              </Field>
              <Field label="Phone">
                <input style={inputStyle} type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="(optional)" />
              </Field>
              <Field label="Anything else I should know?">
                <textarea style={textareaStyle} value={form.notes} onChange={e => update("notes", e.target.value)}
                  placeholder="Special requirements, questions, ideas..." rows={3} />
              </Field>
              {sendError && (
                <p style={{ fontSize: 13, color: "#dc5050", marginTop: 14, padding: "10px 14px", background: "rgba(220,80,80,0.08)", borderRadius: 8, border: "1px solid rgba(220,80,80,0.2)" }}>
                  {sendError}
                </p>
              )}
            </Fade>
          )}

          {/* Step 5: Success */}
          {step === 5 && sent && (
            <Fade key="s5">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", background: "var(--brand-gold-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4,
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M7 14.5L12 19.5L21 9.5" stroke="var(--brand-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 21, fontWeight: 600, textAlign: "center", marginTop: 8, color: "var(--text-primary)" }}>Inquiry Received</h2>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65, margin: "10px 0 20px", maxWidth: 380 }}>
                  Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}! I&apos;ve got everything I need to get started. I&apos;ll review your project details and be in touch soon.
                </p>
                <button onClick={resetForm} style={{
                  padding: "12px 24px", fontSize: 14, background: "transparent",
                  color: "var(--text-secondary)", border: "1.5px solid var(--border-medium)",
                  borderRadius: 8, cursor: "pointer", marginTop: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>Submit Another</button>
              </div>
            </Fade>
          )}

          {/* Navigation */}
          {step > 0 && step < 5 && (
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border-subtle)",
            }}>
              <button onClick={back} style={{
                padding: "12px 16px", fontSize: "13.5px", background: "transparent",
                color: "var(--text-tertiary)", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>← Back</button>
              {step < 4 ? (
                <button
                  style={{
                    padding: "12px 30px", fontSize: "14.5px", fontWeight: 500,
                    background: canAdvance() ? "linear-gradient(135deg, var(--brand-gold), #a8862e)" : "rgba(201,168,76,0.2)",
                    color: canAdvance() ? "var(--brand-foundation)" : "rgba(255,255,255,0.3)",
                    border: "none", borderRadius: 8,
                    cursor: canAdvance() ? "pointer" : "not-allowed",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onClick={next}>Continue</button>
              ) : (
                <button
                  style={{
                    padding: "12px 30px", fontSize: "14.5px", fontWeight: 500,
                    background: (canAdvance() && !sending) ? "linear-gradient(135deg, var(--brand-gold), #a8862e)" : "rgba(201,168,76,0.2)",
                    color: (canAdvance() && !sending) ? "var(--brand-foundation)" : "rgba(255,255,255,0.3)",
                    border: "none", borderRadius: 8, minWidth: 150,
                    cursor: (canAdvance() && !sending) ? "pointer" : "not-allowed",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onClick={sendEmail}>
                  {sending ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span style={{
                        display: "inline-block", width: 14, height: 14,
                        border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "var(--brand-foundation)",
                        borderRadius: "50%", animation: "spin 0.6s linear infinite",
                      }} /> Sending...
                    </span>
                  ) : "Submit Inquiry"}
                </button>
              )}
            </div>
          )}
        </div>

        <p style={{ fontSize: "11.5px", color: "var(--text-tertiary)", marginTop: 16, textAlign: "center", letterSpacing: "0.01em" }}>
          Your responses are saved automatically.
        </p>
      </div>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus {
          border-color: var(--brand-gold) !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
        }
        button:hover:not(:disabled) { opacity: 0.88; }
      `}</style>
    </div>
  );
}
