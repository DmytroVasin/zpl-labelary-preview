const vscode = require('vscode');

const fetchText = (options) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    throw new Error('Text file not found');
  }

  const selectedText = editor.document.getText(editor.selection).trim() || editor.document.getText().trim() || '';
  if (!selectedText) {
    throw new Error('Text not found');
  }

  return base64Decode(removeQuotes(selectedText))
}

const base64Decode = (text) => {
  const decodedZPL = Buffer.from(text, 'base64').toString('binary');
  const encodedZPL = Buffer.from(decodedZPL, 'binary').toString('base64');

  // If the decoded and re-encoded strings match, then text is a valid Base64 string that was successfully processed.
  if (encodedZPL !== text) {
    return text
  }

  const upperDecoded = decodedZPL.toUpperCase();
  // It is not ZPL
  if (upperDecoded.indexOf('^XA') === -1 && upperDecoded.indexOf('^XZ') === -1) {
    return text
  }

  return decodedZPL
}

const removeQuotes = (text) => {
    if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
      return text.slice(1, -1);
  }

  return text;
}

module.exports = {
  fetchText,
};
