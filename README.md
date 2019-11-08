Practical SVG Icons
===================

Everyone loves icons and everyone loves SVGs (and rightly so, they are the [indisputable winner](https://css-tricks.com/icon-fonts-vs-svg/) of the SVG vs Icon Font war).

That said, SVGs are not as easy to work with nor as flexible as Icon Fonts.

For example: You can't easily change the color of an externally referenced SVG icon. Sure, you could inline all SVGs but then your icons are not cacheable and if you use a lot of icons it becomes a tedious task to copy-paste or update them.

The best way seems to [`<use>` icons from an external SVG source](https://css-tricks.com/svg-use-external-source/) wich gives you caching and allows for manipulation of the icon, but you have to create the sprite from your icons manually, and this method doesn't work in CSS at all.

This is a monorepo containing two packages to be used in conjunction that aim to solve these issues:

- **[node-svg-sprite](./node-svg-sprite)**

	Node module wich generates a SVG sprite from a folder of icons

- **[sass-svg-icon](./sass-svg-icon)** (Sass only, for now)

	Function for setting icons as `background-image`, allows passing styling to the icon

