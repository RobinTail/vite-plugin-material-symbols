import type { Literal, Node } from "estree";

export const isStringLiteral = (
  subject: Node,
): subject is Literal & { value: string } =>
  subject.type === "Literal" &&
  "value" in subject &&
  typeof subject.value === "string";

export const defaultUrlProvider = (iconNamesParam: string) =>
  `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&${iconNamesParam}`;

export const makeSelector = (component: string) =>
  [
    `CallExpression[callee.name='jsx'][arguments.0.name='${component}']`,
    ".arguments",
    "Property[key.name='children'] Literal",
  ].join(" > ");
