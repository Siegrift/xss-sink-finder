const {execSync} = require('child_process')

// the list of sinks is taken from: https://wicg.github.io/trusted-types/dist/spec/#idl-index
const SINKS = [
  ['window', 'open'],

  ['document', 'open'],
  ['document', 'write'],
  ['document', 'writeln'],

  ['location', 'href'],
  ['location', 'assign'],
  ['location', 'replace'],

  // these can be part of elements which are basically variables
  ['', 'src'],
  ['', 'text'],
  ['', 'srcdoc'],
  ['', 'data'],
  ['', 'codeBase'],
  ['', 'href'],
  ['', 'action'],
  ['', 'formAction'],
  ['', 'innerText'],
  ['', 'textContent'],
  ['', 'outerHTML'],
  ['', 'insertAdjacentHTML'],
  ['', 'innerHTML'],
  ['', 'createContextualFragment'],
  ['', 'parseFromString'],
]

const USAGE = `
Tries to find all sinks in an repository.
Usage: node finder.js <dir> [<exclude-dir>]

Example react usage: node finder.js ../react/packages __tests__
`

if (process.argv.length <= 2) {
  console.log(USAGE)
} else {
  let path = process.argv[2]
  let exclude = ''
  let excInd = 3
  let excludedDirs = []
  while (process.argv[excInd]) {
    exclude += `--exclude-dir=${process.argv[excInd]} `
    excludedDirs.push(process.argv[excInd])
    excInd++
  }

  console.log(`SEARCHING IN: ${path}, EXCLUDED DIRS: ${JSON.stringify(excludedDirs)}`)
  SINKS.forEach((sink) => {
    console.log(`SEARCHING FOR: ${sink.join('\\.')}`)
    execSync(`grep -HrnI --color=always '${sink.join('\\.')}' ${exclude} 1>&2 ${path} || true`)
  })
}