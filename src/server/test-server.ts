import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

// Create a minimal connection for testing
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
	console.log('Test server initializing...');
	
	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental
		}
	};
	return result;
});

connection.onInitialized(() => {
	console.log('Test server initialized');
});

// Make the text document manager listen on the connection
documents.listen(connection);

// Listen on the connection
console.log('Starting test server...');
connection.listen();