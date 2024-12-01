import esquery from "esquery";
import type { Plugin } from "vite";
import { isStringLiteral } from "./helpers.ts";

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
  getUrl = (iconNamesParam) =>
    `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&${iconNamesParam}`,
}: Partial<PluginOptions> = {}): Plugin => {
  const registry = new Set<string>();

  return {
    name: "material-symbols",
    enforce: "pre",
    moduleParsed: function ({ id, ast }) {
      if (!ast) return;
      const nodes = esquery.query(
        ast,
        `CallExpression[callee.name='jsx'][arguments.0.name='${component}'] > .arguments > Property[key.name='children'] Literal`,
      );
      for (const node of nodes)
        if (isStringLiteral(node)) {
          this.debug({ id, message: node.value });
          registry.add(node.value);
        }
    },
    transformIndexHtml: (html) =>
      html.replace(
        placeholder,
        getUrl(
          registry.size
            ? `icon_names=${Array.from(registry.values()).toSorted().join(",")}`
            : "", // dev mode, all icons
        ),
      ),
  };
};

export default plugin;
