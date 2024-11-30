# vite-plugin-material-symbols

[![coverage](https://coveralls.io/repos/github/RobinTail/vite-plugin-material-symbols/badge.svg)](https://coveralls.io/github/RobinTail/vite-plugin-material-symbols)

The plugin determines which Material Symbols are used in JSX `<Icon>` tags and substitutes this list in `index.html`
for selective download from Google CDN, thus reducing the volume of the font downloaded by the user.

## Demo

Consider a sample React component using MUI Icon:

```tsx
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";

const Component = () => (
  <Stack gap={2}>
    <Icon>home</Icon>
    <Icon>chevron_right</Icon>
    <Icon>comment</Icon>
  </Stack>
);
```

And the Material Symbols linked within `index.html` having `__MATERIAL_SYMBOLS__` placeholder:

```html
<!doctype html>
<html lang="en">
  <head>
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&__MATERIAL_SYMBOLS__"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

Configuring Vite to use the plugin:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import materialSymbols from "vite-plugin-material-symbols";

export default defineConfig({
  plugins: [
    react(),
    materialSymbols({
      // these are defaults:
      component: "Icon",
      placeholder: "__MATERIAL_SYMBOLS__",
    }),
  ],
});
```

After running `vite build`, that link will have the substituted list of sorted icon names:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=chevron_right,comment,home"
  rel="stylesheet"
/>
```