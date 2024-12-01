import esquery from "esquery";
import type { Plugin } from "vite";
import {
  defaultUrlProvider,
  isStringLiteral,
  makeIconNamesParam,
  makeSelector,
} from "./helpers.ts";

type PluginOptions = {
  /**
   * Material Symbols CSS Provider. Default: outlined, no infill, 24px, weight 400
   * @see https://fonts.google.com/icons?icon.set=Material+Symbols
   * @default () => `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...&${iconNamesParam}`
   * */
  getUrl: (iconNamesParam: string) => string;
  /**
   * The text within index.html that should be replaced
   * @default __MATERIAL_SYMBOLS__
   * */
  placeholder: string;
  /**
   * The name of JSX component to obtain the icon names from
   * @default Icon
   * */
  component: string;
};

const plugin = ({
  placeholder = "__MATERIAL_SYMBOLS__",
  component = "Icon",
  getUrl = defaultUrlProvider,
}: Partial<PluginOptions> = {}): Plugin => {
  const registry = new Set<string>();

  return {
    name: "material-symbols",
    enforce: "pre",
    moduleParsed: function ({ id, ast }) {
      if (!ast) return;
      const nodes = esquery
        .query(ast, makeSelector(component))
        .filter(isStringLiteral);
      for (const { value } of nodes) {
        this.debug({ id, message: value });
        registry.add(value);
      }
    },
    transformIndexHtml: (html) =>
      html.replace(placeholder, getUrl(makeIconNamesParam(registry))),
  };
};

export default plugin;
