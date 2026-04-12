"use client";
import { Loader2, Zap, RefreshCw } from "lucide-react";
import { SectionLabel, Btn, Card, TextArea } from "../ui";

export function KnowledgeStep({ loading, quizQuestions, quizAnswers, setQuizAnswers, knowledgeResult, generateQuiz, processQuizAnswers, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Knowledge Assessment</SectionLabel>
        <div style={{ display: "flex", gap: "8px" }}>
          {quizQuestions.length > 0 && Object.keys(quizAnswers).length > 0 && <Btn small primary onClick={processQuizAnswers} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Zap size={14} />} Process</Btn>}
          <Btn small onClick={generateQuiz} disabled={loading}>{loading && !quizQuestions.length ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}{quizQuestions.length ? "New Quiz" : "Generate Quiz"}</Btn>
        </div>
      </div>
      {!quizQuestions.length && !loading && (
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>
          Your answers help Claude understand what terminology and concepts to use vs. explain in its responses. A sentence or two per question is enough — skip what you don't know.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {quizQuestions.map(q => (
          <Card key={q.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#e0e0e0", fontSize: "14px", fontWeight: 600, flex: 1 }}>{q.question}</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", height: "fit-content", background: q.difficulty === "advanced" ? "rgba(220,80,80,0.15)" : q.difficulty === "intermediate" ? "rgba(212,162,78,0.15)" : "rgba(80,180,80,0.15)", color: q.difficulty === "advanced" ? "#dc5050" : q.difficulty === "intermediate" ? "#d4a24e" : "#50b450", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{q.difficulty}</span>
            </div>
            <TextArea value={quizAnswers[q.id] || ""} onChange={v => { setQuizAnswers({ ...quizAnswers, [q.id]: v }); trackActivity(); }} placeholder="Your answer (or skip)" rows={2} label={`Answer for: ${q.question}`} />
          </Card>
        ))}
      </div>
      {quizQuestions.length > 0 && Object.keys(quizAnswers).length > 0 && !knowledgeResult.length && (
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "8px" }}>
          Click "Process" above to analyze your answers and build a knowledge baseline.
        </div>
      )}
      {knowledgeResult.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <SectionLabel>Derived Knowledge Baseline</SectionLabel>
          {knowledgeResult.map((k, i) => <div key={i} style={{ padding: "8px 12px", fontSize: "13px", color: "rgba(255,255,255,0.7)", borderLeft: "2px solid #d4a24e", marginBottom: "6px", marginLeft: "4px" }}>{k}</div>)}
        </div>
      )}
    </div>
  );
}
