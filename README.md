# vite-plugin-material-symbols

[![coverage](https://coveralls.io/repos/github/RobinTail/vite-plugin-material-symbols/badge.svg?branch=main&)](https://coveralls.io/github/RobinTail/vite-plugin-material-symbols?branch=main)

[Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols) is a font-based alternative to SVG icons.
Compared to [Material Icons](https://www.npmjs.com/package/@mui/icons-material), which are packed into a bundle,
thereby increasing its size, font-based symbols are loaded on the user side upon request.

However, the difficulty is that they are either loaded all at once, which is also quite a large volume, or it is
necessary to specify a list of `icon_names` for filtering the font, which must also be sorted. Therefore, it is
necessary to maintain the list of icons used within the application.

The plugin automates that job by determining which icons are used in the source code of the application and during the
build substitutes that list into `index.html` for selective download from Google Font CDN, thus reducing the volume of
the font downloaded by the user.

## Requirements

- Node.js `^20 || ^22`;
- Vite `^6.0.0` (though, it might work with v5 as well).

## Installation

```shell
yarn add -D vite-plugin-material-symbols
```

## Usage

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
    <link href="__MATERIAL_SYMBOLS__" rel="stylesheet" />
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
      getUrl: (iconNamesParam) =>
        `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&${iconNamesParam}`,
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
