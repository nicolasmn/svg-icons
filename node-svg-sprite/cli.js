#!/usr/bin/env node

const path = require('path')
const cli = require('cli')

const SvgSprite = require('./index.js')

cli.enable('status', 'catchall');

const flags = cli.parse({
  src:      [ false, 'Source folder where the icons are', 'dir' ],
  watch:    [ false, 'Watch `src` folder for changes', 'bool', false ],
  svg:      [ false, 'Generate SVG file, leave empty to disable', 'file', ''],
  scss:     [ false, 'Generate Scss file, leave empty to disable', 'file', '' ],
  sass:     [ false, 'Generate Sass file, leave empty to disable', 'file', '' ],
  stylus:   [ false, 'Generate Stylus file, leave empty to disable', 'file', '' ],
  variable: [ false, 'Name of the variable with generated map', 'string', 'svg-icons' ],
  indent:   [ false, 'The character(s) used to indent the generated files', 'string', '\t' ],
  pretty:   [ false, 'Pretty-print the generated SVG file', 'bool', true ],
});

const sprite = new SvgSprite({
  src: flags.src,
  svg: {
    output: path.join(flags.dir, 'icons.svg'),
    pretty: true,
  },
  sass: {
    output: path.join(flags.dir, '_icons.scss'),
    variableName: 'icons',
  }
});

console.log(sprite.options)

sprite.generate().then(cli.output)
