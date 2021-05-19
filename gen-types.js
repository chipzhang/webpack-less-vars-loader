#!/usr/bin/env node

/**
 * Generate `*.less.d.ts` for `*.less` file.
 */

const path = require('path')
const fs = require('fs')
const {parse} = require('./parse')

function main() {
	if (process.argv.length < 3) {
		console.error(`
Generate \`*.less.d.ts\` for \`*.less\` file.

Usage:
node "${__filename}" <less-file> [output-dir]

<less-file> The source \`*.less\` file to extract variables from;
  Variables should be defined in sections \`#less-vars {...}\`;
  Variable names should be kebab-case, and will be converted into camelCase;

[output-dir] The directory to output the generated file \`*.less.d.ts\`;
  Will use the same directory as the source file by default;
`)
		return
	}

	const sourceFile = process.argv[2]
	let outDir = path.dirname(sourceFile)
	if (process.argv.length >= 4) {
		outDir = process.argv[3] // eslint-disable-line prefer-destructuring
		fs.mkdirSync(outDir, {recursive: true})
	}
	const outFile = path.join(outDir, `${path.basename(sourceFile)}.d.ts`)
	const source = fs.readFileSync(sourceFile, {encoding: 'utf-8'})

	const vars = parse(source)
	const content = `const lessVars: {
${Object.entries(vars)
	.reduce((prev, [k]) => prev.concat(`\t'${k}': string`), [])
	.join('\n')}
}
export default lessVars
`

	fs.writeFileSync(outFile, content, {encoding: 'utf-8'})
	console.info(`Generated \`${outFile}\``)
}

main()
