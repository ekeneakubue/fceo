export type ProgramTypeLabel = "NCE" | "Degree" | "Post-Graduate";

const TYPE_TO_DB: Record<ProgramTypeLabel, "NCE" | "DEGREE" | "POST_GRADUATE"> = {
  NCE: "NCE",
  Degree: "DEGREE",
  "Post-Graduate": "POST_GRADUATE",
};

const TYPE_FROM_DB: Record<string, ProgramTypeLabel> = {
  NCE: "NCE",
  DEGREE: "Degree",
  POST_GRADUATE: "Post-Graduate",
};

export function toProgramTypeDb(type: string): "NCE" | "DEGREE" | "POST_GRADUATE" {
  return TYPE_TO_DB[type as ProgramTypeLabel] || "NCE";
}

export function fromProgramTypeDb(type: string): ProgramTypeLabel {
  return TYPE_FROM_DB[type] || "NCE";
}
