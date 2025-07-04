# vite-plugin-material-symbols

![License](https://img.shields.io/github/license/robintail/vite-plugin-material-symbols)
[![coverage](https://coveralls.io/repos/github/RobinTail/vite-plugin-material-symbols/badge.svg?branch=main&)](https://coveralls.io/github/RobinTail/vite-plugin-material-symbols?branch=main)
![Downloads](https://img.shields.io/npm/dw/vite-plugin-material-symbols)

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

- Node.js `^20 || ^22 || ^24`;
- Vite `^6 || ^7`.

## Installation

Install the plugin using your favourite package manager, for example:

```shell
yarn add -D vite-plugin-material-symbols
```

Add it to the Vite configuration:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import materialSymbols from "vite-plugin-material-symbols";

export default defineConfig({
  plugins: [react(), materialSymbols()],
});
```

Ensure having `<head>` tag in your `index.html`.

Ensure assigning the [required](https://developers.google.com/fonts/docs/material_symbols) `className` to your icons.
When using Material UI it can be [globally configured](https://mui.com/material-ui/customization/theme-components/):

```ts
const theme = createTheme({
  components: {
    MuiIcon: {
      defaultProps: {
        /* @see https://fonts.google.com/icons?icon.set=Material+Symbols */
        className: "material-symbols-outlined", // or -rounded or -sharp
      },
    },
  },
});
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

After running `vite build`, the `<link>` tag will be added to your `index.html` having the list of required icon names:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=chevron_right,comment,home"
  rel="stylesheet"
/>
```

## Limitations

The plugin substitutes the `icon_names` URL parameter **ONLY** in `vite build` mode. In `vite dev` (serve) mode
`index.html` is transformed before the application source code, so that all Material Symbols are loaded.

## Configuration

The plugin accepts an object of the following options:

```yaml
component:
  type: string
  description: The name of JSX component to obtain the icon names from
  default: Icon
getUrl:
  type: function
  description: Material Symbols CSS Provider
  arguments: [string] # icon_names parameter
  exampleArguments: ["icon_names=chevron_right,comment,home"] # can be empty string
  returns: string # the URL
  default: (iconNamesParam) => `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&${iconNamesParam}`
preload:
  type: boolean
  description: Enables higher priority for loading symbols
  default: false
```
