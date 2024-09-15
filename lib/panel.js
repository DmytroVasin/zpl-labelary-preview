const vscode = require('vscode');
const { highlightCode } = require('./zpl_highlight');

const getHtmlForWebview = (options) => {
  const { webview, extensionUri, labels, loading, currentPage, dpmm, width, height, dataText } = options;

  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'lib', 'index.js'));
  const scriptElementsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode-elements', 'elements', 'dist', 'bundled.js'));

  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'lib', 'index.css'));
  const styleHighliteJsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'node_modules', 'highlight.js', 'styles', 'atom-one-dark.css'));

  // Use a nonce to only allow specific scripts to be run
  const nonce = getNonce();

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!--
      Use a content security policy to only allow loading images from https or from our extension directory,
      and only allow scripts that have a specific nonce.
    -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}';">

    <link href="${styleUri}" rel="stylesheet" />
    <link href="${styleHighliteJsUri}" rel="stylesheet" />

    <title>ZPL Labelary Preview</title>
  </head>
  <body>
    <vscode-form-group>
      <vscode-label>
        <span>Download:</span>
      </vscode-label>
      <vscode-button class="download-btn" value="zpl">ZPL</vscode-button>
      <vscode-button class="download-btn" value="png">PNG</vscode-button>
      <vscode-button class="download-btn" value="pdf">Multi-Label PDF</vscode-button>
    </vscode-form-group>

    <vscode-form-group>
      <vscode-label>
        <span>Print Density:</span>
      </vscode-label>
      <vscode-single-select id="select-density">
        <vscode-option ${dpmm === '6' && 'selected'} value="6">6 dpmm (152 dpi)</vscode-option>
        <vscode-option ${dpmm === '8' && 'selected'} value="8">8 dpmm (203 dpi)</vscode-option>
        <vscode-option ${dpmm === '12' && 'selected'} value="12">12 dpmm (300 dpi)</vscode-option>
        <vscode-option ${dpmm === '24' && 'selected'} value="24">24 dpmm (600 dpi)</vscode-option>
      </vscode-single-select>
    </vscode-form-group>

    <vscode-form-group>
      <vscode-label>
        <span>Label Size:</span>
      </vscode-label>
      <vscode-textfield id="label_size__width" value=${width}></vscode-textfield>
      <span>x</span>
      <vscode-textfield id="label_size__height" value=${height}></vscode-textfield>
      <vscode-button id="refresh">Update</vscode-button>
    </vscode-form-group>

    <vscode-form-group>
      <vscode-button id="rotate">Rotate</vscode-button>
    </vscode-form-group>

    <vscode-tabs selected-index="0">
      <vscode-tab-header slot="header">Label</vscode-tab-header>
      <vscode-tab-panel>
        <vscode-form-group variant="vertical">
          ${
            labels.length > 1 ? `
              ${
                labels.map((_, page) => {
                  return `<vscode-button class="pagination-btn" ${currentPage === page ? 'disabled' : ''} value=${page}>${page + 1}</vscode-button>`
                }).join('')
              }
            ` :
            ''
          }
        </vscode-form-group>

        ${
          labels.length ? `
          <div id="label-box">
            <img id="label" class='rotation' nonce="${nonce}" src="data:image/png;base64,${labels[currentPage]}"/>
          </div>
          `
          :
          ''
        }

        ${
          loading ? `Loading...` : ''
        }

        ${
          (!loading && !labels.length) ? `ERROR` : ''
        }
      </vscode-tab-panel>

      <vscode-tab-header slot="header">Source Code</vscode-tab-header>
      <vscode-tab-panel>
        <vscode-form-group variant="vertical">
          <vscode-button id="copy-to-clipboard">Copy</vscode-button>
        </vscode-form-group>
        <div id='source-code-panel'>
          <pre>${highlightCode(dataText)}</pre>
        </div>
      </vscode-tab-panel>
    </vscode-tabs>

    <script nonce="${nonce}" src="${scriptUri}"></script>
    <script nonce="${nonce}" src="${scriptElementsUri}" type="module"></script>
  </body>
  </html>`;
};

const getNonce = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = {
  getHtmlForWebview,
};
