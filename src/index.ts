import esquery from "esquery";
import type { Node } from "estree";
import type { HtmlTagDescriptor, Plugin } from "vite";
import {
  defaultUrlProvider,
  isStringLiteral,
  makeIconNamesParam,
  makeSelector,
} from "./helpers.ts";

type PluginOptions = {
  /**
   * The regex to match module IDs that should be processed for finding icon names
   * @default /\.([jt])sx?$/i
   * */
  moduleIdRegex: RegExp;
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
   * Enables higher priority for loading symbols
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preconnect
   * @default false
   */
  preload: boolean;
};

const plugin = ({
  moduleIdRegex = /.([jt])sx?$/i,
  component = "Icon",
  getUrl = defaultUrlProvider,
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
      const selector = makeSelector(component);
      const literals = esquery.query(ast as Node, selector);
      const strings = literals.filter(isStringLiteral);
      for (const { value } of strings) {
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
