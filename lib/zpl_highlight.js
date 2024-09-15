const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('zpl', () => ({
  case_insensitive: true,
  unicodeRegex: true,
  keywords: 'if else for while return',
  contains: [
    {
      className: 'comment',
      begin: '\\^FX',
      end: '(?=\\^)',
      relevance: 0
    },
    {
      className: 'keyword',
      begin: '\\^(DFR|XFR|ISR|ILR)',
      end: '(?=\\^)',
      relevance: 0
    },
    {
      className: 'variable',
      begin: /(\^FN[0-9]*)/,
      relevance: 0
    },
    {
      className: 'string',
      begin: '\\^FD', end: '\\^FS',
      contains: [hljs.BACKSLASH_ESCAPE],
      // excludeBegin: true,
      // excludeEnd: true,
      relevance: 0
    },
    {
      className: 'symbol',
      begin: '\\^.{2}',
      relevance: 0
    },
  ]
}))

const prettify = (zplText) => {
  if (zplText.includes('\n')) {
    return zplText
  }

  // NOTE: It is not optimal - but good for visibility
  let zplAsArray = [zplText]

  // Split after:
  zplAsArray = zplAsArray.flatMap(line => line.split(/(?<=\^XA)/g))
  zplAsArray = zplAsArray.flatMap(line => line.split(/(?<=\^FS)/g))

  // Split before:
  zplAsArray = zplAsArray.flatMap(line => line.split(/(?=\^XZ)/g))

  // General:
  zplAsArray = zplAsArray.map(line => line.trim())

  return zplAsArray.join('\n');
}

const highlightCode = (dataText) => {
  return hljs.highlight(prettify(dataText), { language: 'zpl' }).value
}

module.exports = {
  highlightCode,
};
