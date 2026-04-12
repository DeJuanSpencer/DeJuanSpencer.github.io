"use client";
import { SectionLabel, TextArea, Input } from "../ui";
import { RefinePanel, RefineBtn, GenerateBtn } from "../FieldRefinement";

export function ContextStep({ projectName, setProjectName, domain, setDomain, projectDesc, setProjectDesc, goals, setGoals, refineSuggestions, generateLoading, refineLoading, generateField, refineField, acceptRefinement, dismissRefinement, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {[
        ["Project Name", "name", projectName, setProjectName, false, "My AI project"],
        ["Domain", "domain", domain, setDomain, false, "e.g. B2B SaaS sales, medical research, creative writing..."],
        ["Project Description", "description", projectDesc, setProjectDesc, true, "What is this Claude project designed to do?"],
        ["Goals", "goals", goals, setGoals, true, "What outcomes should this project produce?"],
      ].map(([label, field, val, setter, isTextarea, placeholder]) => (
        <div key={field}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
            <SectionLabel>{label}</SectionLabel>
            <div style={{ display: "flex", gap: "6px" }}>
              <GenerateBtn field={field} onGenerate={generateField} isLoading={generateLoading[field]} />
              <RefineBtn field={field} disabled={!val} onRefine={refineField} isLoading={refineLoading[field]} />
            </div>
          </div>
          {isTextarea
            ? <TextArea value={val} onChange={v => { setter(v); trackActivity(); }} placeholder={placeholder} />
            : <Input value={val} onChange={v => { setter(v); trackActivity(); }} placeholder={placeholder} />
          }
          <RefinePanel field={field} suggestion={refineSuggestions[field]} onAccept={acceptRefinement} onDismiss={dismissRefinement} />
        </div>
      ))}
    </div>
  );
}
