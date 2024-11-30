import type {Plugin} from "vite";
import esquery, {type Literal} from "esquery";

const plugin = (): Plugin => {
  const registry = new Set<string>;

  return ({
    name: "material-symbols",
    enforce: "pre",
    moduleParsed: function ({id, ast}) {
      if (!ast) return;
      const nodes = esquery.query(
        ast,
        "CallExpression[callee.name='jsx'][arguments.0.name='Icon'] > .arguments > Property[key.name='children'] Literal",
      ) as unknown as Literal[];
      this.debug({id, message: "value"});
      for (const {value} of nodes) if (typeof value === "string") registry.add(value);
    },
    transformIndexHtml: (html) =>
      html.replace(
        "__MATERIAL_SYMBOLS__",
        registry.size
          ? `icon_names=${Array.from(registry.values()).toSorted().join(",")}`
          : "", // dev mode, all icons
      ),
  });
};

export default plugin;
