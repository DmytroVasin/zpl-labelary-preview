const vscode = require('vscode');
const { ZplPreviewer } = require('./lib/zpl_previewer');

function activate(context) {
	const viewLabelCommand = vscode.commands.registerCommand('zpl-labelary-preview.view-label', () => {
		new ZplPreviewer(context);
	});

	context.subscriptions.push(viewLabelCommand);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
