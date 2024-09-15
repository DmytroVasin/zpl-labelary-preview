const vscode = require('vscode');
const axios = require('axios').default;
const { fetchText } = require('./text_detector');
const { getHtmlForWebview } = require('./panel');
const { saveFile } = require('./download');

class ZplPreviewer {
  constructor(context) {
    this.context = context
    this.panel = null
    this.cache = {}

    this.labels = []
    this.loading = false
    this.currentPage = 0
    this.dpmm = this.context.globalState.get('dpmm', '8')
    this.width = this.context.globalState.get('width', '4')
    this.height = this.context.globalState.get('height', '6')

    this.dataText = this.fetchTextSafely()
    if (!this.dataText) {
      return
    }

    this.createPannel()
    this.fetchLabels()
  }

  createPannel() {
    this.panel = vscode.window.createWebviewPanel(
      "zpl_labelary_preview_panel",
      "Labelary Viewer",
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );

    this.panel.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case 'densityChanged':
          this.dpmm = message.value;
          this.context.globalState.update('dpmm', this.dpmm);

          this.fetchLabels()
          break;
        case 'refreshLabelSize':
          this.width = message.value.width
          this.context.globalState.update('width', this.width)

          this.height = message.value.height
          this.context.globalState.update('height', this.height)

          this.fetchLabels()
          break;
        case 'changePage':
          this.currentPage = parseInt(message.value);

          this.drawPanel()
          break;
        case 'copyToClipboard':
          vscode.env.clipboard.writeText(this.dataText).then(() => {
            vscode.window.showInformationMessage('Copied!');
          });
          break;
        case 'download':
          saveFile({
            type: message.value,
            labels: this.labels,
            currentPage: this.currentPage,
            dpmm: this.dpmm,
            width: this.width,
            height: this.height,
            dataText: this.dataText,
          })
          break;
      }
    });
  }

  drawPanel() {
    this.panel.webview.html = getHtmlForWebview({
      extensionUri: this.context.extensionUri,
      webview: this.panel.webview,
      labels: this.labels,
      loading: this.loading,
      currentPage: this.currentPage,
      dpmm: this.dpmm,
      width: this.width,
      height: this.height,
      dataText: this.dataText,
    })
  }

  async fetchLabels() {
    this.labels = []
    this.loading = true

    try {
      this.drawPanel()

      const labels = await this.fetchLabelaryLabels()

      if (labels.length === 0) {
        throw new Error('Label is empty');
      }

      this.labels = labels
      this.loading = false
      this.drawPanel()
    } catch (error) {
      this.loading = false
      this.drawPanel()

      let error_message = error.message || 'An unknown error occurred';
      if (error?.response?.data) {
        error_message = Buffer.from(error.response.data).toString()
      }

      vscode.window.showErrorMessage(`Error on rendering ZPL preview: ${error_message}`);
    }
  }

  async fetchLabelaryLabels() {
    const data = []

    let response = await this.fetchLabelaryLabel(0);
    data.push(response.label)

    // TODO: Think! How to handle multiple labels
    for (let page = 1; page < response.total_pages; page++) {
      response = await this.fetchLabelaryLabel(page)

      data.push(response.label)
    }

    return data
  }

  async fetchLabelaryLabel(page) {
    const url = `http://api.labelary.com/v1/printers/${this.dpmm}dpmm/labels/${this.width}x${this.height}/${page}`

    if (this.cache[url]) {
      return this.cache[url]
    }

    const response = await axios.post(
      url,
      this.dataText,
      {
        responseType: 'arraybuffer',
        responseEncoding: 'binary',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'image/png',
        },
        timeout: 5000,
      }
    )

    if (response.status !== 200) {
      throw new Error(`Labelary API returned status code ${response.status}`);
    }

    const result = {
      total_pages: parseInt(response.headers["x-total-count"]),
      label: Buffer.from(response.data).toString('base64'),
    }

    this.cache[url] = result;
    return result;
  }

  fetchTextSafely() {
    try {
      return fetchText()
    } catch (error) {
      vscode.window.showErrorMessage(`Error on parsing text: ${error.message || 'An unknown error occurred'}`);
    }
  }
}

module.exports = {
  ZplPreviewer
};
