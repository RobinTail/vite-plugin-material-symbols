import type { Literal, Node } from "estree";

export const isStringLiteral = (
  subject: Node,
): subject is Literal & { value: string } =>
  subject.type === "Literal" &&
  "value" in subject &&
  typeof subject.value === "string";

export const defaultFontUrl =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";

export const makeSelector = (
  jsxNodeRegex: RegExp,
  component: RegExp | string,
) => {
  const calleeName = `/${jsxNodeRegex.source}/${jsxNodeRegex.flags}`;
  const argName =
    typeof component === "string"
      ? `'${component}'`
      : `/${component.source}/${component.flags}`;
  return [
    `CallExpression[callee.name=${calleeName}][arguments.0.name=${argName}]`,
    ".arguments",
    "Property[key.name='children'] Literal",
  ].join(" > ");
};

/**
 * @see https://www.measurethat.net/Benchmarks/Show/12088/3/new-array-from-vs-slice-vs-push-vs-index-vs-spread
 * @see https://www.measurethat.net/Benchmarks/Show/27622/0/sort-vs-tosorted-vs-spread-and-sort-vs-just-spread
 * */
export const addIconNamesParam = (url: string, registry: Set<string>) => {
  const target = new URL(url);
  if (registry.size) {
    const arr: string[] = [];
    for (const item of registry.values()) arr.push(item);
    target.searchParams.append("icon_names", arr.toSorted().join(","));
  }
  return decodeURIComponent(target.toString());
};
