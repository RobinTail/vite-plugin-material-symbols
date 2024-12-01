import type { Literal, Node } from "estree";

export const isStringLiteral = (
  subject: Node,
): subject is Literal & { value: string } =>
  subject.type === "Literal" &&
  "value" in subject &&
  typeof subject.value === "string";
