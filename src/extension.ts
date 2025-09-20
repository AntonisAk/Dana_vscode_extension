import * as vscode from 'vscode';
import * as path from 'path';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

function registerCommands(context: vscode.ExtensionContext) {
	// Insert main function command
	const insertMainCommand = vscode.commands.registerCommand('dana.insertMainFunction', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.document.languageId === 'dana') {
			const mainFunctionTemplate = `def main
\tbegin
\t\t# Your code here
\tend`;
			
			editor.edit(editBuilder => {
				editBuilder.insert(editor.selection.active, mainFunctionTemplate);
			});
		}
	});
	
	// Format document command (placeholder - could be enhanced later)
	const formatCommand = vscode.commands.registerCommand('dana.formatDocument', () => {
		vscode.window.showInformationMessage('Dana formatting is not yet implemented.');
	});
	
	context.subscriptions.push(insertMainCommand, formatCommand);
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Dana Language Support extension is now active!');
	
	// Register commands
	registerCommands(context);
	
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(path.join('out', 'server', 'server.js'));
	console.log('Server module path:', serverModule);
	
	// Check if server file exists
	const fs = require('fs');
	if (!fs.existsSync(serverModule)) {
		console.error('Server module not found at:', serverModule);
		vscode.window.showErrorMessage('Dana Language Server: server.js not found. Please rebuild the extension.');
		return;
	}
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: { execArgv: ['--nolazy', '--inspect=6009'] }
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for dana documents
		documentSelector: [{ scheme: 'file', language: 'dana' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'danaLanguageServer',
		'Dana Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	try {
		client.start().then(() => {
			console.log('Dana Language Server started successfully');
		}).catch((error: any) => {
			console.error('Failed to start Dana Language Server:', error);
			vscode.window.showErrorMessage(`Dana Language Server failed to start: ${error.message || error}`);
		});
	} catch (error) {
		console.error('Error starting language client:', error);
		vscode.window.showErrorMessage(`Failed to start Dana Language Server: ${error}`);
	}
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
