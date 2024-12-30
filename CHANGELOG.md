# Changelog

## Version 0

### v0.3.0

- Fixed the leading slash problem in `dev` mode (serve mode);
- The `placeholder` option removed;
- Placing the `<link>` tag into `index.html` is no longer required:
  - The plugin will add `<link>` tag to the `<head>` by itself.

### v0.2.2

- Performance improvement:
  - using `for..of` and `Array::push()` instead of `Array::from()`.
- Extracted helpers to make the plugin code more readable.

### v0.2.1

- Improving documentation;
- Clarifying Node.js 20 and 22 as the system requirement.

### v0.2.0

- The `placeholder` is now a complete URL of the Material Symbols CDN;
- New option `getUrl` is a function returning that URL based on
  the `iconNamesParam` argument;
- All that allows to keep the HTML link this way:

```html
<link rel="stylesheet" href="__MATERIAL_SYMBOLS__" />
```

### v0.1.1

- Fixed debugging message;

### v0.1.0

- Two configuration options: `placeholder` and `component`.

### v0.0.2

- Initial release, basic operation.
