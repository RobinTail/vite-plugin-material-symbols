import esquery from "esquery";
import type { HtmlTagDescriptor, Plugin } from "vite";
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
   * The name of JSX component to obtain the icon names from
   * @default Icon
   * */
  component: string;
  /**
   * Enables higher priority to loading symbols
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload
   * @default false
   */
  preload: boolean;
};

const plugin = ({
  component = "Icon",
  getUrl = defaultUrlProvider,
  preload = false,
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
    transformIndexHtml: (html) => {
      const href = getUrl(makeIconNamesParam(registry));
      const tags: HtmlTagDescriptor[] = [
        {
          injectTo: "head",
          tag: "link",
          attrs: { rel: "stylesheet", href },
        },
      ];
      if (preload) {
        tags.push({
          injectTo: "head-prepend",
          tag: "link",
          attrs: { rel: "preload", as: "style", href },
        });
      }
      return { html, tags };
    },
  };
};

export default plugin;
