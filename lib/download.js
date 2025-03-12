const vscode = require('vscode');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const os = require('os');
const { buildLabelaryUrl, makeLabelaryRequest } = require('./labelary_api');

const saveFile = (options) => {
  const { type, dataText, dpmm, width, height, units, labels, currentPage } = options;

  switch (type) {
    case 'zpl':
      saveFileZpl(dataText)
      break;

    case 'png':
      saveFilePng(labels, currentPage)
      break;

    case 'pdf':
      saveFilePdf(dataText, dpmm, width, height, units)
      break;
  }
}

const saveFileZpl = (dataText) => {
  const fileContent = dataText

  fileSaver({
    content: fileContent,
    extension: 'zpl',
    encoding: 'utf8',
  })
}

const saveFilePng = (labels, currentPage) => {
  if (!labels[currentPage]) {
    vscode.window.showErrorMessage('Error saving file: No label to save');
    return
  }

  const fileContent = labels[currentPage]

  fileSaver({
    content: fileContent,
    extension: 'png',
    encoding: 'base64',
  })
}

const saveFilePdf = async (dataText, dpmm, width, height, units) => {
  let fileContent = ''

  try {
    fileContent = await fetchLabelaryPDF(dataText, dpmm, width, height, units)
  } catch (error) {
    vscode.window.showErrorMessage(`Error saving file: ${error.message}`);
    return
  }

  fileSaver({
    content: fileContent,
    extension: 'pdf',
    encoding: 'binary',
  })
}

const fileSaver = (options) => {
  const fileName = `label-${Date.now()}.${options.extension}`
  const defaultFilePath = path.join(os.homedir(), "Downloads", fileName);

  vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(defaultFilePath),
    filters: {
      'All Files': ['*']
    },
  }).then((fileInfos) => {
    if (fileInfos) {
      fs.writeFile(fileInfos.fsPath, options.content, { encoding: options.encoding }, function (error) {
        if (error) {
          vscode.window.showErrorMessage(`Error saving file: ${error.message}`);
        } else {
          vscode.window.showInformationMessage(`File saved: ${fileInfos.fsPath}`);
        }
      });
    }
  });
}

const fetchLabelaryPDF = async (dataText, dpmm, width, height, units) => {
  const url = buildLabelaryUrl(dpmm, width, height, units, 0)
  const response = await makeLabelaryRequest(url, dataText, 'pdf')

  return response.data;
}

module.exports = {
  saveFile,
};
