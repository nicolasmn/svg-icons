const fs = require('fs')
const merge = require('lodash.merge')
const svgTools = require('simple-svg-tools')
const HTMLParser = require('fast-html-parser')


class GenerateIcons {
	static get defaults() {
		return {
			src: 'src',           // Source folder where the icons are
			dest: 'sprite.svg',   // Filepath of the generated SVG sprite
			optimize: true,       // Optimize loaded icons
			sass: {               // Sass specific options, `false` to disable
				writeFile: false,             // Write file to disk, `false` or filepath
				variableName: 'svg-icons',    // Name of the variable with generated map
			}
		}
	}

	constructor(options) {
		this.options = merge({}, this.constructor.defaults, options)
		this.load()
	}

	/**
	 * Loads all SVG files from `options.src` dir
	 * @returns {void}
	 */
	load() {
		this.icons = new Promise((resolve, reject) => {
			try {
				svgTools.ImportDir(this.options.src).then(collection => {
					if (this.options.optimize) {
						collection.promiseAll(svg => svgTools.SVGO(svg)).then(results => {
							const collection = new svgTools.Collection()
							for (const name in results) {
								collection.add(name, results[name])
							}
							resolve(collection)
						})
					} else {
						resolve(collection)
					}
				})
			} catch(err) {
				reject(err)
			}
		})
	}

	/**
	 * Converts all icons into an Sass map string
	 * @returns {Promise<string>}
	 */
	async toSassMap() {
		const icons = await this.icons
		const array = [];

		icons.forEach((svg, name) => {
			array.push(`\t${name}: '${svg.toString()}',`)
		})

		const map = ['(', ...array, ')'].join('\n')
		return `$${this.options.sass.variableName}: ${map};`
	}

	/**
	 * Converts all icons into an SVG sprite string
	 * @returns {Promise<string>}
	 */
	async toSvgSprite() {
		const icons = await this.icons
		const array = []

		icons.forEach((svg, name) => {
			const attrs = getRootAttributes(svg.toString())
			attrs.id = name
			attrs.width = '100%'
			attrs.height = '100%'

			array.push(`\t\t<symbol ${toAttributeString(attrs)}>${svg.getBody()}</symbol>`)
		});

		const defs = `\t<defs>\n${array.join('\n')}\n\t</defs>`
		const svg = `<svg xmlns="http://www.w3.org/2000/svg">\n${defs}\n</svg>`

		if (this.options.optimize) {
			return svg
				.replace(/[\n\r\t]/g, ' ')   // Replace newlines and tabs with space
				.replace(/\s+/g, ' ')        // Replace group spaces with single space
				.replace(/> </g, '><')       // Remove spaces between tags
		}

		return svg
	}

	/**
	 * Writes a Sass file containing a map with all icons to the given filepath
	 * @param   {string} filepath [this.options.sass.writeFile]
	 * @returns {void}
	 */
	async writeSassMap(filepath = this.options.sass.writeFile) {
		if (!filepath || typeof filepath !== 'string') {
			throw new Error('You must pass a path where the file should be written')
		}
		const data = await this.toSassMap()
		fs.writeFile(filepath, data, (err) => {
			if (err) {
				throw new Error(err)
			}
			console.info('Scss file written to', filepath)
		})
	}

	/**
	 * Writes a SVG file containing all icons as symbols to the given filepath
	 * @param   {string} filepath [this.options.dest]
	 * @returns {void}
	 */
	async writeSvgSprite(filepath = this.options.dest) {
		const data = await this.toSvgSprite()
		fs.writeFile(filepath, data, (err) => {
			if (err) {
				throw new Error(err)
			}
			console.info('SVG sprite written to', filepath)
		})
	}

	/**
	 * Generate SVG sprite and/or Sass map from loaded icons
	 * @returns {Promise<string>|void} Returns the Sass map if `options.sass.writeFile = false`
	 */
	async generate() {
		this.writeSvgSprite()

		if (this.options.sass) {
			if (this.options.sass.writeFile) {
				this.writeSassMap()
			} else {
				return this.toSassMap()
			}
		}
	}
}

/**
 * Converts an object to an attribute string
 * @param   {object} object
 * @returns {string}
 */
function toAttributeString(object) {
	const attrs = [];
	for (const key in object) {
		const value = object[key]
		if (value) {
			attrs.push(`${key}="${value}"`)
		}
	}
	return attrs.join(' ')
}

/**
 * Returns an object with the root elements attributes
 * @param   {string} string
 * @returns {object}
 */
function getRootAttributes(string) {
	const parsed = HTMLParser.parse(string)
	const attrs = parsed.firstChild.attributes
	delete attrs.xmlns
	return attrs
}

module.exports = GenerateIcons
