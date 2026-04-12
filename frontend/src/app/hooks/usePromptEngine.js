"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { callClaude } from "../lib/claudeApi";
import { buildOutput, STEPS } from "../lib/outputBuilder";
import { getSupabaseClient } from "../lib/supabase/client";

const TABLE = "prompt_engine_states";

export function usePromptEngine(user) {
  // Non-persisted UI state
  const [appMode, setAppMode] = useState("create");
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBlurb, setCopiedBlurb] = useState(false);
  const [error, setError] = useState(null);
  const [showAssist, setShowAssist] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [itemLoading, setItemLoading] = useState({});
  const [generateLoading, setGenerateLoading] = useState({});
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [flippedCards, setFlippedCards] = useState({ without: false, with: false });
  const lastActivity = useRef(Date.now());
  const idleTimer = useRef(null);

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);

  // Hydration tracking — don't save until initial load from Supabase completes
  const [hydrating, setHydrating] = useState(true);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Persisted state (server-backed)
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [domain, setDomain] = useState("");
  const [goals, setGoals] = useState("");
  const [customInjection, setCustomInjection] = useState("");
  const [refineLoading, setRefineLoading] = useState({});
  const [refineSuggestions, setRefineSuggestions] = useState({});
  const [identityOptions, setIdentityOptions] = useState([]);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [knowledgeResult, setKnowledgeResult] = useState([]);
  const [negativeSuggestions, setNegativeSuggestions] = useState([]);
  const [selectedNegatives, setSelectedNegatives] = useState(new Set());
  const [modes, setModes] = useState([]);
  const [defaultModeIdx, setDefaultModeIdx] = useState(0);
  const [priorities, setPriorities] = useState([]);
  const [failures, setFailures] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templatesEnabled, setTemplatesEnabled] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState(new Set());
  const [examples, setExamples] = useState([]);
  const [approvedExamples, setApprovedExamples] = useState(new Set());
  const [compiledOutput, setCompiledOutput] = useState("");
  const [pastedInstructions, setPastedInstructions] = useState("");
  const [parsedPreview, setParsedPreview] = useState(null);
  const [selectedSections, setSelectedSections] = useState(new Set());

  // Load state from Supabase when user becomes available
  useEffect(() => {
    if (!user) {
      hydratedRef.current = false;
      setHydrating(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error: fetchErr } = await supabase
          .from(TABLE)
          .select("state")
          .eq("user_id", user.id)
          .maybeSingle();
        if (cancelled) return;
        if (fetchErr) {
          console.error("Failed to load state:", fetchErr);
        } else if (data?.state) {
          const s = data.state;
          if (typeof s.step === "number") setStep(s.step);
          if (typeof s.projectName === "string") setProjectName(s.projectName);
          if (typeof s.projectDesc === "string") setProjectDesc(s.projectDesc);
          if (typeof s.domain === "string") setDomain(s.domain);
          if (typeof s.goals === "string") setGoals(s.goals);
          if (typeof s.customInjection === "string") setCustomInjection(s.customInjection);
          if (Array.isArray(s.identityOptions)) setIdentityOptions(s.identityOptions);
          if (s.selectedIdentity === null || typeof s.selectedIdentity === "number") setSelectedIdentity(s.selectedIdentity);
          if (Array.isArray(s.quizQuestions)) setQuizQuestions(s.quizQuestions);
          if (s.quizAnswers && typeof s.quizAnswers === "object") setQuizAnswers(s.quizAnswers);
          if (Array.isArray(s.knowledgeResult)) setKnowledgeResult(s.knowledgeResult);
          if (Array.isArray(s.negativeSuggestions)) setNegativeSuggestions(s.negativeSuggestions);
          if (Array.isArray(s.selectedNegatives)) setSelectedNegatives(new Set(s.selectedNegatives));
          if (Array.isArray(s.modes)) setModes(s.modes);
          if (typeof s.defaultModeIdx === "number") setDefaultModeIdx(s.defaultModeIdx);
          if (Array.isArray(s.priorities)) setPriorities(s.priorities);
          if (Array.isArray(s.failures)) setFailures(s.failures);
          if (Array.isArray(s.templates)) setTemplates(s.templates);
          if (typeof s.templatesEnabled === "boolean") setTemplatesEnabled(s.templatesEnabled);
          if (Array.isArray(s.selectedTemplates)) setSelectedTemplates(new Set(s.selectedTemplates));
          if (Array.isArray(s.examples)) setExamples(s.examples);
          if (Array.isArray(s.approvedExamples)) setApprovedExamples(new Set(s.approvedExamples));
        }
      } catch (e) {
        console.error("Supabase load error:", e);
      } finally {
        if (!cancelled) {
          hydratedRef.current = true;
          setHydrating(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Debounced upsert to Supabase whenever persisted state changes
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    if (!user || !hydratedRef.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const supabase = getSupabaseClient();
        const state = {
          step,
          projectName, projectDesc, domain, goals, customInjection,
          identityOptions, selectedIdentity,
          quizQuestions, quizAnswers, knowledgeResult,
          negativeSuggestions, selectedNegatives: [...selectedNegatives],
          modes, defaultModeIdx, priorities, failures,
          templates, templatesEnabled, selectedTemplates: [...selectedTemplates],
          examples, approvedExamples: [...approvedExamples],
        };
        const { error: saveErr } = await supabase
          .from(TABLE)
          .upsert(
            { user_id: user.id, state, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );
        if (saveErr) console.error("Failed to save state:", saveErr);
      } catch (e) {
        console.error("Supabase save error:", e);
      }
    }, 500);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [user, step, projectName, projectDesc, domain, goals, customInjection, identityOptions, selectedIdentity, quizQuestions, quizAnswers, knowledgeResult, negativeSuggestions, selectedNegatives, modes, defaultModeIdx, priorities, failures, templates, templatesEnabled, selectedTemplates, examples, approvedExamples]);

  const showError = (msg) => { setError(msg); setTimeout(() => setError(null), 6000); };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackSending(true);
    const fromEmail = user?.email || "anonymous";
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_qwklm7m",
          template_id: "template_y15185ka",
          user_id: "gOPO4EaCND8y0uBjl",
          template_params: {
            from_name: fromEmail,
            message: `PROMPT ENGINE FEEDBACK\n\nFrom: ${fromEmail}\n\n${feedbackText}`,
            to_name: "DeJuan",
          },
        }),
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error("Feedback send failed:", err);
      showError("Feedback failed to send. Please try again.");
    }
    setFeedbackSending(false);
  };

  useEffect(() => {
    const checkIdle = () => { if (Date.now() - lastActivity.current > 90000 && step < 9) setShowAssist(true); };
    idleTimer.current = setInterval(checkIdle, 15000);
    return () => clearInterval(idleTimer.current);
  }, [step]);

  const trackActivity = useCallback(() => { lastActivity.current = Date.now(); setShowAssist(false); }, []);

  const buildOutputMemo = useCallback(
    () => buildOutput({ selectedIdentity, identityOptions, knowledgeResult, selectedNegatives, negativeSuggestions, modes, defaultModeIdx, priorities, failures, templatesEnabled, selectedTemplates, templates, approvedExamples, examples, customInjection }),
    [selectedIdentity, identityOptions, knowledgeResult, selectedNegatives, negativeSuggestions, modes, defaultModeIdx, priorities, failures, templatesEnabled, selectedTemplates, templates, approvedExamples, examples, customInjection]
  );

  useEffect(() => { setCompiledOutput(buildOutputMemo()); }, [buildOutputMemo]);

  const getContext = () => ({
    name: projectName, description: projectDesc, domain, goals,
    identity: selectedIdentity !== null ? identityOptions[selectedIdentity] : null,
    knowledge: knowledgeResult, negatives: [...selectedNegatives].map(i => negativeSuggestions[i]),
    modes, priorities, failures,
  });

  const withLoading = async (fn) => {
    setLoading(true); trackActivity();
    try { await fn(); }
    catch (e) {
      const msg = e?.message?.includes("fetch") || e?.message?.includes("network") || e?.message?.includes("Failed to fetch")
        ? "Network error. Check your connection and try again."
        : "Generation failed. Try again or move to the next step.";
      showError(msg);
      console.error(e);
    }
    finally { setLoading(false); }
  };

  const generateField = async (field) => {
    setGenerateLoading(p => ({ ...p, [field]: true })); trackActivity();
    const ctx = { name: projectName, domain, description: projectDesc, goals };
    const other = Object.entries(ctx).filter(([k]) => k !== field && ctx[k]).map(([k, v]) => `${k}: ${v}`).join("\n");
    const prompts = {
      name: { system: `You generate a clear concise project name for an AI project. Return ONLY valid JSON: {"generated":"the project name"}`, user: `Generate a project name.\nContext:\n${other || "No context yet."}` },
      domain: { system: `You generate a precise domain label for an AI project. Return ONLY valid JSON: {"generated":"specific domain label"}`, user: `Generate a domain label.\nContext:\n${other || "No context yet."}` },
      description: { system: `You generate a clear 2-3 sentence project description for an AI project. Return ONLY valid JSON: {"generated":"project description text"}`, user: `Generate a project description.\nContext:\n${other || "No context yet."}` },
      goals: { system: `You generate sharp measurable project goals for an AI project. Return ONLY valid JSON: {"generated":"goal text"}`, user: `Generate project goals.\nContext:\n${other || "No context yet."}` },
    };
    const p = prompts[field];
    const result = await callClaude(p.system, p.user);
    if (result?.generated) {
      if (field === "name") setProjectName(result.generated);
      if (field === "domain") setDomain(result.generated);
      if (field === "description") setProjectDesc(result.generated);
      if (field === "goals") setGoals(result.generated);
    } else showError(`Generate failed for ${field}. Try again.`);
    setGenerateLoading(p => ({ ...p, [field]: false }));
  };

  const refineField = async (field) => {
    setRefineLoading(p => ({ ...p, [field]: true })); trackActivity();
    const vals = { name: projectName, domain, description: projectDesc, goals };
    const fieldValue = vals[field] || "";
    const other = Object.entries(vals).filter(([k]) => k !== field && vals[k]).map(([k, v]) => `${k}: ${v}`).join("\n");
    const prompts = {
      name: { system: `You help users craft clear concise project names for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined project name","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Project Name: "${fieldValue}"\nContext:\n${other}` },
      domain: { system: `You help users define precise domain labels for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined domain label","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Domain: "${fieldValue}"\nContext:\n${other}` },
      description: { system: `You help users write precise project descriptions for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined description text","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Description: "${fieldValue}"\nContext:\n${other}` },
      goals: { system: `You help users define sharp measurable project goals for AI project instructions. Analyze and return ONLY valid JSON with exactly these keys: {"improved":"refined goals text","reasoning":"why this is better","alternatives":["alt1","alt2"],"tips":["tip1"],"missingInfo":[]}`, user: `Goals: "${fieldValue}"\nContext:\n${other}` },
    };
    const p = prompts[field];
    if (!p) { setRefineLoading(prev => ({ ...prev, [field]: false })); return; }
    const result = await callClaude(p.system, p.user);
    if (result?.improved) setRefineSuggestions(prev => ({ ...prev, [field]: result }));
    else { showError("Refinement failed. Try again or edit the field manually."); console.error("Refine result:", result); }
    setRefineLoading(prev => ({ ...prev, [field]: false }));
  };

  const acceptRefinement = (field, value) => {
    if (field === "name") setProjectName(value);
    if (field === "domain") setDomain(value);
    if (field === "description") setProjectDesc(value);
    if (field === "goals") setGoals(value);
    setRefineSuggestions(prev => { const n = { ...prev }; delete n[field]; return n; });
    trackActivity();
  };
  const dismissRefinement = (field) => { setRefineSuggestions(prev => { const n = { ...prev }; delete n[field]; return n; }); };

  const generateIdentities = () => withLoading(async () => {
    const r = await callClaude(`You generate professional role identities for AI assistants based on project context. Return ONLY valid JSON array of 3 objects: [{"title":"...","description":"...","traits":["...","...","..."]}]`, `Project: ${projectName}\nDescription: ${projectDesc}\nDomain: ${domain}\nGoals: ${goals}`);
    if (r && !r._error) setIdentityOptions(r); else showError(r?._error || "Identity generation failed. Try again.");
  });
  const generateQuiz = () => withLoading(async () => {
    const r = await callClaude(`You create knowledge assessment quizzes for a specific domain. Return ONLY valid JSON array of 5 question objects: [{"id":"q1","question":"...","topic":"...","difficulty":"beginner|intermediate|advanced"}]`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}`);
    if (r && !r._error) { setQuizQuestions(r); setQuizAnswers({}); } else showError(r?._error || "Quiz generation failed. Try again.");
  });
  const processQuizAnswers = () => withLoading(async () => {
    const qa = quizQuestions.map(q => ({ question: q.question, answer: quizAnswers[q.id] || "skipped", topic: q.topic }));
    const r = await callClaude(`You analyze knowledge assessment quiz responses and derive what the user knows. Return ONLY valid JSON array of strings: ["User understands X","User has working knowledge of Y"]`, `Domain: ${domain}\nAnswers: ${JSON.stringify(qa)}`);
    if (r && !r._error) setKnowledgeResult(r); else showError(r?._error || "Quiz processing failed. Try again.");
  });
  const generateNegativeSpace = () => withLoading(async () => {
    const r = await callClaude(`You identify counterproductive AI behaviors for a specific domain and project. Return ONLY valid JSON array: [{"behavior":"short name","instruction":"do not... directive","reason":"why this matters"}]`, `Project: ${projectName}\nDomain: ${domain}\nDescription: ${projectDesc}`);
    if (r && !r._error) { setNegativeSuggestions(r); setSelectedNegatives(new Set(r.map((_, i) => i))); } else showError(r?._error || "Guardrail generation failed. Try again.");
  });
  const generateModes = () => withLoading(async () => {
    const r = await callClaude(`You design operational modes for AI assistants. Return ONLY valid JSON: {"modes":[{"name":"...","trigger":"one word or short phrase","description":"...","characteristics":["...","...","..."]}],"defaultMode":0}`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}\nGoals: ${goals}`, 8000);
    if (r && !r._error) { setModes(r.modes || []); setDefaultModeIdx(r.defaultMode || 0); } else showError(r?._error || "Mode generation failed. Try again.");
  });
  const regenerateMode = async (idx) => {
    setItemLoading(p => ({ ...p, [`mode_${idx}`]: true }));
    const r = await callClaude(`You design a single operational mode for an AI assistant. Return ONLY valid JSON object: {"name":"...","trigger":"one word or short phrase","description":"...","characteristics":["...","...","..."]}`, `Domain: ${domain}\nProject: ${projectName}\nExisting modes to avoid duplicating: ${modes.map(m => m.name).join(", ")}`);
    if (r && !r._error) setModes(prev => prev.map((m, i) => i === idx ? r : m)); else showError(r?._error || "Regenerate failed. Try again.");
    setItemLoading(p => ({ ...p, [`mode_${idx}`]: false }));
  };
  const generatePriorities = () => withLoading(async () => {
    const ctx = getContext();
    const r = await callClaude(`You define priority hierarchies that resolve conflicts between AI behavioral rules. Return ONLY valid JSON array ordered highest to lowest: [{"rule":"clear priority statement","overrides":"what lower rule this beats","exception":"when this rule does not apply"}]`, `Project: ${projectName}\nDomain: ${domain}\nIdentity: ${JSON.stringify(ctx.identity)}`);
    if (r && !r._error) setPriorities(r); else showError(r?._error || "Priority generation failed. Try again.");
  });
  const regeneratePriority = async (idx) => {
    setItemLoading(p => ({ ...p, [`priority_${idx}`]: true }));
    const ctx = getContext();
    const r = await callClaude(`You define a single priority rule for AI behavior conflict resolution. Return ONLY valid JSON object: {"rule":"clear priority statement","overrides":"what this beats","exception":"when it doesn't apply"}`, `Project: ${projectName}\nDomain: ${domain}\nIdentity: ${JSON.stringify(ctx.identity)}\nExisting rules to avoid duplicating: ${priorities.map(p => p.rule).join("; ")}`);
    if (r && !r._error) setPriorities(prev => prev.map((p, i) => i === idx ? r : p)); else showError(r?._error || "Regenerate failed. Try again.");
    setItemLoading(p => ({ ...p, [`priority_${idx}`]: false }));
  };
  const generateFailures = () => withLoading(async () => {
    const r = await callClaude(`You identify common AI failure patterns in a specific domain. Return ONLY valid JSON array: [{"pattern":"name of failure pattern","prevention":"specific instruction to prevent it","severity":"low|medium|high"}]`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}`);
    if (r && !r._error) setFailures(r); else showError(r?._error || "Failure generation failed. Try again.");
  });
  const regenerateFailure = async (idx) => {
    setItemLoading(p => ({ ...p, [`failure_${idx}`]: true }));
    const r = await callClaude(`You identify a single AI failure pattern for a specific domain. Return ONLY valid JSON object: {"pattern":"name of failure pattern","prevention":"specific instruction to prevent it","severity":"low|medium|high"}`, `Domain: ${domain}\nProject: ${projectName}\nExisting patterns to avoid duplicating: ${failures.map(f => f.pattern).join("; ")}`);
    if (r && !r._error) setFailures(prev => prev.map((f, i) => i === idx ? r : f)); else showError(r?._error || "Regenerate failed. Try again.");
    setItemLoading(p => ({ ...p, [`failure_${idx}`]: false }));
  };
  const generateTemplates = () => withLoading(async () => {
    const r = await callClaude(`You design response format templates for AI assistants. Return ONLY valid JSON array of 4 objects: [{"name":"template name","trigger":"when to use this","format":"the actual format structure with placeholders"}]`, `Domain: ${domain}\nProject: ${projectName}\nDescription: ${projectDesc}`);
    if (r && !r._error) { setTemplates(r); setSelectedTemplates(new Set()); } else showError(r?._error || "Template generation failed. Try again.");
  });
  const generateExamples = () => withLoading(async () => {
    const ctx = getContext();
    const r = await callClaude(`You create ideal example interactions for AI assistants. Return ONLY valid JSON array of 3 objects: [{"userMessage":"realistic user input","idealResponse":"ideal assistant response","reasoning":"why this response is ideal"}]`, `Project: ${projectName}\nDomain: ${domain}\nIdentity: ${JSON.stringify(ctx.identity)}\nNegatives: ${JSON.stringify(ctx.negatives)}`, 3000);
    if (r && !r._error) { setExamples(r); setApprovedExamples(new Set()); } else showError(r?._error || "Example generation failed. Try again.");
  });

  const autoFillCurrent = () => withLoading(async () => {
    const id = STEPS[step].id;
    if (id === "context") {
      if (!projectName) await generateField("name");
      if (!domain) await generateField("domain");
      if (!projectDesc) await generateField("description");
      if (!goals) await generateField("goals");
    }
    if (id === "identity" && !identityOptions.length) await generateIdentities();
    if (id === "knowledge" && !quizQuestions.length) await generateQuiz();
    if (id === "negative" && !negativeSuggestions.length) await generateNegativeSpace();
    if (id === "modes" && !modes.length) await generateModes();
    if (id === "priority" && !priorities.length) await generatePriorities();
    if (id === "failure" && !failures.length) await generateFailures();
    if (id === "templates" && !templates.length) await generateTemplates();
    if (id === "examples" && !examples.length) await generateExamples();
  });

  const handleEditParse = () => withLoading(async () => {
    const r = await callClaude(
      `You extract structured information from any Claude project instructions or context document — whether it is a compiled lever output, strategic prose, or a mix of both. Do your best to populate as many fields as possible. If a field cannot be determined, use an empty string or empty array. Never omit a key. Return ONLY valid JSON with exactly this shape, no preamble, no markdown:
{"projectName":"","domain":"","description":"","goals":"","identity":{"title":"","description":"","traits":[]},"knowledge":[],"negatives":[{"behavior":"","instruction":"","reason":""}],"modes":[{"name":"","trigger":"","description":"","characteristics":[]}],"priorities":[{"rule":"","overrides":"","exception":""}],"failures":[{"pattern":"","prevention":"","severity":"medium"}],"templates":[],"examples":[]}`,
      `Extract everything you can from this document into the JSON structure:\n\n${pastedInstructions.slice(0, 8000)}`,
      4000
    );
    if (r && !r._error) {
      setParsedPreview(r);
      const available = new Set();
      if (r.projectName || r.domain || r.description || r.goals) available.add("context");
      if (r.identity?.title) available.add("identity");
      if (r.knowledge?.length) available.add("knowledge");
      if (r.negatives?.length) available.add("negatives");
      if (r.modes?.length) available.add("modes");
      if (r.priorities?.length) available.add("priorities");
      if (r.failures?.length) available.add("failures");
      if (r.templates?.length) available.add("templates");
      if (r.examples?.length) available.add("examples");
      if (available.size === 0) { showError("Nothing could be extracted. Check your instructions format."); return; }
      setSelectedSections(available);
    } else showError(r?._error ? `Parse error: ${r._error}` : "Parse failed. Check your input and try again.");
  });

  const applyParsed = () => {
    const r = parsedPreview;
    if (selectedSections.has("context")) {
      if (r.projectName) setProjectName(r.projectName);
      if (r.domain) setDomain(r.domain);
      if (r.description) setProjectDesc(r.description);
      if (r.goals) setGoals(r.goals);
    }
    if (selectedSections.has("identity") && r.identity?.title) { setIdentityOptions([r.identity]); setSelectedIdentity(0); }
    if (selectedSections.has("knowledge") && r.knowledge?.length) setKnowledgeResult(r.knowledge);
    if (selectedSections.has("negatives") && r.negatives?.length) { setNegativeSuggestions(r.negatives); setSelectedNegatives(new Set(r.negatives.map((_, i) => i))); }
    if (selectedSections.has("modes") && r.modes?.length) setModes(r.modes);
    if (selectedSections.has("priorities") && r.priorities?.length) setPriorities(r.priorities);
    if (selectedSections.has("failures") && r.failures?.length) setFailures(r.failures);
    if (selectedSections.has("templates") && r.templates?.length) { setTemplates(r.templates); setTemplatesEnabled(true); setSelectedTemplates(new Set(r.templates.map((_, i) => i))); }
    if (selectedSections.has("examples") && r.examples?.length) { setExamples(r.examples); setApprovedExamples(new Set(r.examples.map((_, i) => i))); }
    setParsedPreview(null); setPastedInstructions(""); setAppMode("create"); setStep(0);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(compiledOutput);
      setCopied(true); setShowFireworks(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowFireworks(false), 3000);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = compiledOutput;
        Object.assign(ta.style, { position: "fixed", left: "-9999px", top: "-9999px", opacity: "0" });
        document.body.appendChild(ta); ta.focus(); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
        setCopied(true); setShowFireworks(true);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setShowFireworks(false), 3000);
      } catch { showError("Copy failed. Try selecting the text manually."); }
    }
  };

  const copyBlurb = async () => {
    const projectBlurb = `${projectDesc}${goals ? " Goal: " + goals.trim().replace(/\.?\s*$/, ".") : ""}`.trim();
    try {
      await navigator.clipboard.writeText(projectBlurb);
      setCopiedBlurb(true); setTimeout(() => setCopiedBlurb(false), 2000);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = projectBlurb;
        Object.assign(ta.style, { position: "fixed", left: "-9999px", top: "-9999px", opacity: "0" });
        document.body.appendChild(ta); ta.focus(); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
        setCopiedBlurb(true); setTimeout(() => setCopiedBlurb(false), 2000);
      } catch { showError("Copy failed."); }
    }
  };

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDragEnd = () => {
    if (dragIdx !== null && dragOverIdx !== null && dragIdx !== dragOverIdx) {
      const arr = [...priorities]; const [moved] = arr.splice(dragIdx, 1); arr.splice(dragOverIdx, 0, moved); setPriorities(arr);
    }
    setDragIdx(null); setDragOverIdx(null);
  };
  const movePriority = (idx, dir) => {
    const arr = [...priorities]; const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]]; setPriorities(arr);
  };

  const updateIdentityOption = useCallback((idx, changes) => {
    setIdentityOptions(prev => prev.map((opt, i) => i === idx ? { ...opt, ...changes } : opt));
  }, []);

  const updateMode = useCallback((idx, changes) => {
    setModes(prev => prev.map((m, i) => i === idx ? { ...m, ...changes } : m));
  }, []);

  const updateNegative = useCallback((idx, changes) => {
    setNegativeSuggestions(prev => prev.map((n, i) => i === idx ? { ...n, ...changes } : n));
  }, []);

  const updatePriority = useCallback((idx, changes) => {
    setPriorities(prev => prev.map((p, i) => i === idx ? { ...p, ...changes } : p));
  }, []);

  const updateFailure = useCallback((idx, changes) => {
    setFailures(prev => prev.map((f, i) => i === idx ? { ...f, ...changes } : f));
  }, []);

  const updateExample = useCallback((idx, changes) => {
    setExamples(prev => prev.map((e, i) => i === idx ? { ...e, ...changes } : e));
  }, []);

  const projectBlurb = `${projectDesc}${goals ? " Goal: " + goals.trim().replace(/\.?\s*$/, ".") : ""}`.trim();
  const canAdvance = () => step === 0 ? !!(projectName || domain || projectDesc || goals) : true;

  return {
    // Navigation
    step, setStep,
    appMode, setAppMode,
    showPreview, setShowPreview,
    showMobileNav, setShowMobileNav,
    flippedCards, setFlippedCards,
    isMobile,
    // UI feedback
    loading,
    copied,
    copiedBlurb,
    error,
    showAssist,
    showFireworks,
    itemLoading,
    generateLoading,
    refineLoading,
    // Drag
    dragIdx,
    dragOverIdx,
    // Hydration (true while initial load from Supabase is in flight)
    hydrating,
    // Feedback
    feedbackText, setFeedbackText,
    feedbackSubmitted,
    feedbackSending,
    // Step 0
    projectName, setProjectName,
    projectDesc, setProjectDesc,
    domain, setDomain,
    goals, setGoals,
    customInjection, setCustomInjection,
    refineSuggestions,
    // Step 1
    identityOptions,
    selectedIdentity, setSelectedIdentity,
    // Step 2
    quizQuestions,
    quizAnswers, setQuizAnswers,
    knowledgeResult, setKnowledgeResult,
    // Step 3
    negativeSuggestions,
    selectedNegatives, setSelectedNegatives,
    // Step 4
    modes,
    defaultModeIdx, setDefaultModeIdx,
    // Step 5
    priorities,
    // Step 6
    failures,
    // Step 7
    templates,
    templatesEnabled, setTemplatesEnabled,
    selectedTemplates, setSelectedTemplates,
    // Step 8
    examples,
    approvedExamples, setApprovedExamples,
    // Step 9 + edit mode
    compiledOutput,
    pastedInstructions, setPastedInstructions,
    parsedPreview, setParsedPreview,
    selectedSections, setSelectedSections,
    // Computed
    projectBlurb,
    canAdvance,
    // Handlers
    showError,
    submitFeedback,
    trackActivity,
    generateField,
    refineField,
    acceptRefinement,
    dismissRefinement,
    generateIdentities,
    generateQuiz,
    processQuizAnswers,
    generateNegativeSpace,
    generateModes,
    regenerateMode,
    generatePriorities,
    regeneratePriority,
    generateFailures,
    regenerateFailure,
    generateTemplates,
    generateExamples,
    autoFillCurrent,
    handleEditParse,
    applyParsed,
    copyToClipboard,
    copyBlurb,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    movePriority,
    updateIdentityOption,
    updateMode,
    updateNegative,
    updatePriority,
    updateFailure,
    updateExample,
  };
}
