import esquery, { type Literal } from "esquery";
import type { Plugin } from "vite";

type PluginOptions = {
  /**
   *
   * @default () => `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...&${iconNamesParam}`
   * */
  getUrl: (iconNamesParam: string) => string;
  /** @default __MATERIAL_SYMBOLS__ */
  placeholder: string;
  /** @default Icon */
  component: string;
};

const plugin = ({
  component = "Icon",
  placeholder = "__MATERIAL_SYMBOLS__",
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
      ) as unknown as Literal[];
      for (const { value } of nodes)
        if (typeof value === "string") {
          this.debug({ id, message: value });
          registry.add(value);
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
