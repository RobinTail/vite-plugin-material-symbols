import esquery, { type Literal } from "esquery";
import type { Plugin } from "vite";

type PluginOptions = {
  /** @default __MATERIAL_SYMBOLS__ */
  placeholder: string;
  /** @default Icon */
  component: string;
};

const plugin = ({
  placeholder = "__MATERIAL_SYMBOLS__",
  component = "Icon",
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
        registry.size
          ? `icon_names=${Array.from(registry.values()).toSorted().join(",")}`
          : "", // dev mode, all icons
      ),
  };
};

export default plugin;
