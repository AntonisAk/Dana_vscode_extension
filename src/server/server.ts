import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	Hover,
	MarkupKind
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import { getAllCompletionItems, getHoverInfo } from './danaLanguage';
import { validateDanaDocument, ValidationSettings } from './diagnostics';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	console.log('Dana Language Server initializing...');
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true,
				triggerCharacters: ['.', ':', '(']
			},
			// Tell the client that this server supports hover information.
			hoverProvider: true
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	console.log('Dana Language Server initialized successfully');
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'danaLanguageServer'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	try {
		// Get the settings for this document
		const settings = await getDocumentSettings(textDocument.uri);

		// Use the Dana language validator
		const diagnostics = validateDanaDocument(textDocument, settings);

		// Send the computed diagnostics to VSCode.
		connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
	} catch (error) {
		console.error('Error in document validation:', error);
		// Send empty diagnostics on error to avoid crashes
		connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: [] });
	}
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have a change in VSCode
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		try {
			const completionItems = getAllCompletionItems();
			
			return completionItems.map(item => {
				let kind: CompletionItemKind;
				
				switch (item.kind) {
					case 'keyword':
						kind = CompletionItemKind.Keyword;
						break;
					case 'type':
						kind = CompletionItemKind.TypeParameter;
						break;
					case 'operator':
						kind = CompletionItemKind.Operator;
						break;
					case 'boolean':
						kind = CompletionItemKind.Constant;
						break;
					case 'function':
						kind = CompletionItemKind.Function;
						break;
					default:
						kind = CompletionItemKind.Text;
				}
				
				return {
					label: item.name,
					kind: kind,
					detail: item.detail,
					documentation: item.documentation,
					data: item.name // Store the name for resolve if needed
				};
			});
		} catch (error) {
			console.error('Error in completion handler:', error);
			return [];
		}
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		// For now, just return the item as-is
		// In the future, we could add more detailed documentation here
		return item;
	}
);

// This handler provides hover information
connection.onHover(
	(params: TextDocumentPositionParams): Hover | null => {
		try {
			const document = documents.get(params.textDocument.uri);
			if (!document) {
				return null;
			}

			const position = params.position;
			const text = document.getText();
			const offset = document.offsetAt(position);
			
			// Find the word at the cursor position
			const wordRange = getWordRangeAtPosition(text, offset);
			if (!wordRange) {
				return null;
			}
			
			const word = text.substring(wordRange.start, wordRange.end);
			const hoverInfo = getHoverInfo(word);
			
			if (hoverInfo) {
				return {
					contents: {
						kind: hoverInfo.isMarkdown ? MarkupKind.Markdown : MarkupKind.PlainText,
						value: hoverInfo.content
					}
				};
			}
			
			return null;
		} catch (error) {
			console.error('Error in hover handler:', error);
			return null;
		}
	}
);

// Helper function to find word boundaries at a given position
function getWordRangeAtPosition(text: string, offset: number): {start: number, end: number} | null {
	if (offset < 0 || offset > text.length) {
		return null;
	}
	
	// Find word start
	let start = offset;
	while (start > 0 && /[a-zA-Z_]/.test(text[start - 1])) {
		start--;
	}
	
	// Find word end
	let end = offset;
	while (end < text.length && /[a-zA-Z_0-9]/.test(text[end])) {
		end++;
	}
	
	if (start === end) {
		return null;
	}
	
	return { start, end };
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
try {
	console.log('Starting Dana Language Server...');
	connection.listen();
} catch (error) {
	console.error('Failed to start Dana Language Server:', error);
	process.exit(1);
}