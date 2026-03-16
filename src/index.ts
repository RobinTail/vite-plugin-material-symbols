import esquery from "esquery";
import type { Node } from "estree";
import type { HtmlTagDescriptor, Plugin } from "vite";
import {
  addIconNamesParam,
  defaultFontUrl,
  isStringLiteral,
  makeSelector,
} from "./helpers.ts";

type PluginOptions = {
  /**
   * The regex to match module IDs that should be processed for finding icon names
   * @default /\.([jt])sx?$/i
   * */
  moduleIdRegex: RegExp;
  /**
   * The regex to match JSX nodes that should be processed in parsed AST (e.g. "jsx", "_jsx" or "jsxs")
   * @default /jsx/
   * */
  jsxNodeRegex: RegExp;
  /**
   * Material Symbols CSS Provider. Default: outlined, no infill, 24px, weight 400
   * @see https://fonts.google.com/icons?icon.set=Material+Symbols
   * @default "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
   * */
  fontUrl: string;
  /**
   * The name of the query parameter to add to the fontUrl
   * @default "icon_names"
   * */
  paramName: string;
  /**
   * The name of JSX component to get the icon names from (or regex to match the component name)
   * @default "Icon"
   * */
  component: string | RegExp;
  /**
   * Enables higher priority for loading symbols
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preconnect
   * @default false
   */
  preload: boolean;
};

const plugin = ({
  moduleIdRegex = /.([jt])sx?$/i,
  jsxNodeRegex = /jsx/,
  component = "Icon",
  fontUrl = defaultFontUrl,
  paramName = "icon_names",
  preload = false,
}: Partial<PluginOptions> = {}): Plugin => {
  const registry = new Set<string>();

  return {
    name: "material-symbols",
    enforce: "pre",
    moduleParsed: function ({ id, code }) {
      if (!code) return;
      if (!moduleIdRegex.test(id)) return;
      const ast = this.parse(code);
      const selector = makeSelector(jsxNodeRegex, component);
      const literals = esquery.query(ast as Node, selector);
      const strings = literals.filter(isStringLiteral);
      for (const { value } of strings) {
        this.debug({ id, message: value });
        registry.add(value);
      }
    },
    transformIndexHtml: (html) => {
      const href = addIconNamesParam(fontUrl, paramName, registry).toString();
      const tags: HtmlTagDescriptor[] = [
        {
          injectTo: "head",
          tag: "link",
          attrs: { rel: "stylesheet", href },
        },
      ];
      if (preload) {
        tags.push(
          {
            injectTo: "head-prepend",
            tag: "link",
            attrs: { rel: "preload", as: "style", href },
          },
          {
            injectTo: "head-prepend",
            tag: "link",
            attrs: { rel: "preconnect", href: "https://fonts.gstatic.com" },
          },
        );
      }
      return { html, tags };
    },
  };
};

export default plugin;
