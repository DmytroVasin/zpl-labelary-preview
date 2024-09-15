const vscode = require('vscode');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const os = require('os');

const saveFile = (options) => {
  const { type, dataText, dpmm, width, height, labels, currentPage } = options;

  switch (type) {
    case 'zpl':
      saveFileZpl(dataText)
      break;

    case 'png':
      saveFilePng(labels, currentPage)
      break;

    case 'pdf':
      saveFilePdf(dataText, dpmm, width, height)
      break;
  }
}

const saveFileZpl = (dataText) => {
  const fileContent = dataText

  fileSaver({
    content: fileContent,
    extention: 'zpl',
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
    extention: 'png',
    encoding: 'base64',
  })
}

const saveFilePdf = async (dataText, dpmm, width, height) => {
  let fileContent = ''

  try {
    fileContent = await fetchLabelaryPDF(dataText, dpmm, width, height)
  } catch (error) {
    vscode.window.showErrorMessage(`Error saving file: ${error.message}`);
    return
  }

  fileSaver({
    content: fileContent,
    extention: 'pdf',
    encoding: 'binary',
  })
}

const fileSaver = (options) => {
  const fileName = `label-${Date.now()}.${options.extention}`
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

const fetchLabelaryPDF = async (dataText, dpmm, width, height) => {
  const url = `http://api.labelary.com/v1/printers/${dpmm}dpmm/labels/${width}x${height}/`

  const response = await axios.post(
    url,
    dataText,
    {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/pdf',
      },
      timeout: 5000,
    }
  )

  if (response.status !== 200) {
    throw new Error(`Labelary API returned status code ${response.status}`);
  }

  return response.data;
}

module.exports = {
  saveFile,
};
