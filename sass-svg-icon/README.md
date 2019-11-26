SVG icons as background-images
==============================

`svg-icon()` is a Sass function that helps with SVG icons as background-images.

- Inlines SVG icons as URI
- Allows passing styling to the icon using a generated style tag

Here is a basic example:
```scss
$svg-icons: (
  circle: '<svg viewBox="0 0 100 100"><circle fill="currentColor" cx="50" cy="50" r="50"></circle></svg>'
);

@import "sass-svg-icon";

.foo {
  background-image: svg-icon(circle, red)
}
```

Compiles to:
```css
.foo {
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cdefs%3E%3Cstyle%3E:root{color:red;}%3C/style%3E%3C/defs%3E%3Ccircle fill="currentColor" cx="50" cy="50" r="50"%3E%3C/circle%3E%3C/svg%3E');
}
```

## How to use it

1. Install
  - with npm: `npm install nicolasmn/svg-icons --save`  
    OR [download _svg-icon.scss]() into your project.

2. Import the partial in your Sass files and define `$svg-icons` map before the file is imported:

  ```scss
  // Define the names of your icons and pass the SVG source as value
  $svg-icons: (
    <name>: <source>
  );

  // Pass additional characters to encode in SVG source strings
  $svg-icons-encode: (
    <search>: <replace>
  );

  // If _svg-icons.scss is in your project:
  @import 'path/to/svg-icon';
  // With webpack (and boilerplates such as create-react-app)
  @import '~svg-icons/sass-svg-icon';
  ```

### Simple

The simplest way of using `svg-icon()` is passing just a color after the icon name:

```scss
.foo {
  background-image: svg-icon(bar, red)
}
```

When using this pattern the generated style tag will use the `:root` selector and colorizing works using the `currentColor` variable, so that needs to be set as `fill` or `stroke` on the relevant element(s).

If you want to set more than just the color or in cases where you can't change the source of the icons you can also pass a map of CSS attributes that will be applied using the `:root` selector as well:

```scss
.foo {
  background-image: svg-icon(bar, (
    stroke: red,
    stroke-width: 2px
  ));
}
```

### Complex

For more complex situations such as multicolor icons you need to define a Sass map with selectors for the specific elements like so:

```scss
.foo {
  background-image: svg-icon(bar, (
    '.foobar': ( fill: red ),
    '.foobar > *': ( fill: blue )
  ))
}
```

This pattern also allows defining `@keyframes` or `@media` queries and really any kind of valid CSS (just remember to stick to the Sass map syntax):

```scss
.foo {
  background-image: svg-icon(bar, (
    '@media (min-width: 100px)': (
      '.foobar': ( fill: red )
    )
  ))
}
```

_Note: Media-Queries inside SVGs behave more like Element-Queries_

## Ceveats

This method won't work in IE at all because of the generated `<style>` tag inside the SVG wich is not supported for inline background images (don't ask).

If you need to support IE you could use a [selector hack](http://browserhacks.com/) targeting only the versions you need and don't pass any styles to `svg-icon()` in there.
