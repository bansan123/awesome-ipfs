const fs = require('fs')
const path = require('path')
const yaml = require('node-yaml')

const dataDir = path.join(__dirname, '../data')
const readme = path.join(__dirname, '../README.md')

function sort (a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function sortInv (a, b) {
  return -sort(a, b)
}

function sortAlphabetically (a, b) {
  a = a.toLowerCase()
  b = b.toLowerCase()
  return sort(a, b)
}

const files = fs.readdirSync(dataDir)
  .map(file => path.join(dataDir, file))
  .map(file => yaml.readSync(file))
  .sort((a, b) => sortAlphabetically(a.title, b.title))
  .map(cat => {
    if (cat.title === 'Articles') {
      cat.content = cat.content.sort((a, b) => sortInv(a.date, b.date))
    } else {
      cat.content = cat.content.sort((a, b) => sortAlphabetically(a.name, b.name))
    }

    return cat
  })

function slugify (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const toc = files.map(category => `- [${category.title}](#${slugify(category.title)})`).join('\n')

const sections = files.map(category => {
  const content = category.content.map(item => {
    let block = '- '

    if (item.date) block += item.date + ': '
    block += `[${item.name}](${item.url}) `
    if (item.description) block += `- ${item.description.trim()}`
    if (item.demo) {
      if (!item.description) block += '-'
      block += ` [Demo](${item.demo})`
    }
    if (item.source) {
      block += ` [Source](${item.source})`
    }

    return block
  }).join('\n')

  return `## ${category.title}\n\n${content}`
}).join('\n\n')

fs.writeFileSync(readme, `# Awesome IPFS [![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)

> Useful resources for using [IPFS](https://ipfs.io) and building things on top of it

_This list is for projects, tools, or pretty much any things related to IPFS that
are totally_ **awesome**_. This is for products which are already awesome - if
you have plans for cool stuff to do with IPFS, you should build it, and then
link it here. If you have an idea for an awesome thing to do with IPFS, a good
place to ask about it might be in [ipfs/apps](https://github.com/ipfs/apps) or
[ipfs/notes](https://github.com/ipfs/notes)._

## Table of Contents

${toc}
- [Discussions](#discussions)
- [Contribute](#contribute)
  - [Want to hack on IPFS?](#want-to-hack-on-ipfs)
- [License](#license)

${sections}

## Discussions

* [CRDTs discussion](https://github.com/ipfs/notes/issues/23)

## Contribute

Please add (or remove) stuff from this list if you see anything awesome! [Open an issue](https://github.com/ipfs/awesome-ipfs/issues) or a PR.

### Want to hack on IPFS?

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)`)
