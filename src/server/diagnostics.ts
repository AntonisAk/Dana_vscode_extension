import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DANA_KEYWORDS, DANA_BUILTIN_FUNCTIONS, DANA_OPERATORS } from './danaLanguage';

export interface ValidationSettings {
	maxNumberOfProblems: number;
}

export function validateDanaDocument(textDocument: TextDocument, settings: ValidationSettings): Diagnostic[] {
	const text = textDocument.getText();
	const diagnostics: Diagnostic[] = [];
	const lines = text.split(/\r?\n/);

	// Basic syntax validation
	for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
		const line = lines[lineNumber];
		const lineText = line.trim();
		
		// Skip empty lines and comments
		if (lineText === '' || lineText.startsWith('#') || lineText.startsWith('(*')) {
			continue;
		}

		// Check for basic syntax errors
		validateLine(textDocument, line, lineNumber, diagnostics);
		
		// Limit the number of problems reported
		if (diagnostics.length >= settings.maxNumberOfProblems) {
			break;
		}
	}

	return diagnostics;
}

function validateLine(textDocument: TextDocument, line: string, lineNumber: number, diagnostics: Diagnostic[]): void {
	// Check for unmatched brackets/parentheses
	checkBracketMatching(textDocument, line, lineNumber, diagnostics);
	
	// Check for invalid assignment operators
	checkAssignmentOperators(textDocument, line, lineNumber, diagnostics);
	
	// Check for undefined keywords (basic spell check)
	checkUndefinedTokens(textDocument, line, lineNumber, diagnostics);
	
	// Check for basic variable declaration syntax
	checkVariableDeclarations(textDocument, line, lineNumber, diagnostics);
}

function checkBracketMatching(textDocument: TextDocument, line: string, lineNumber: number, diagnostics: Diagnostic[]): void {
	const brackets = { '(': ')', '[': ']', '{': '}' };
	const stack: string[] = [];
	
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		
		if (char in brackets) {
			stack.push(char);
		} else if (Object.values(brackets).includes(char)) {
			const lastOpen = stack.pop();
			if (!lastOpen || brackets[lastOpen as keyof typeof brackets] !== char) {
				const diagnostic: Diagnostic = {
					severity: DiagnosticSeverity.Error,
					range: {
						start: { line: lineNumber, character: i },
						end: { line: lineNumber, character: i + 1 }
					},
					message: `Unmatched closing bracket '${char}'`,
					source: 'dana-language-server'
				};
				diagnostics.push(diagnostic);
			}
		}
	}
	
	// Check for unclosed brackets
	if (stack.length > 0) {
		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: lineNumber, character: 0 },
				end: { line: lineNumber, character: line.length }
			},
			message: `Unclosed bracket(s): ${stack.join(', ')}`,
			source: 'dana-language-server'
		};
		diagnostics.push(diagnostic);
	}
}

function checkAssignmentOperators(textDocument: TextDocument, line: string, lineNumber: number, diagnostics: Diagnostic[]): void {
	// Check for common mistakes like using '=' instead of ':='
	const equalMatches = line.matchAll(/\b(\w+)\s*=\s*([^=<>])/g);
	
	for (const match of equalMatches) {
		const index = match.index || 0;
		const equalIndex = line.indexOf('=', index);
		
		// Skip if it's part of a comparison operator
		if (line[equalIndex + 1] === '=' || line[equalIndex - 1] === '!' || 
			line[equalIndex - 1] === '<' || line[equalIndex - 1] === '>') {
			continue;
		}
		
		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: { line: lineNumber, character: equalIndex },
				end: { line: lineNumber, character: equalIndex + 1 }
			},
			message: "Did you mean ':=' for assignment instead of '='?",
			source: 'dana-language-server'
		};
		diagnostics.push(diagnostic);
	}
}

function checkUndefinedTokens(textDocument: TextDocument, line: string, lineNumber: number, diagnostics: Diagnostic[]): void {
	// Extract potential keywords/identifiers
	const tokens = line.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
	const allKnownSymbols = new Set([
		...DANA_KEYWORDS.map(k => k.name),
		...DANA_BUILTIN_FUNCTIONS.map(f => f.name),
		// Add some common variable patterns that shouldn't trigger warnings
		'i', 'j', 'k', 'x', 'y', 'z', 'n', 'len', 'size', 'count', 'temp', 'result'
	]);
	
	tokens.forEach(token => {
		// Skip if it's a known symbol, number, or looks like a variable
		if (allKnownSymbols.has(token) || /^\d/.test(token) || token.length <= 2) {
			return;
		}
		
		// Check if it looks like it could be a misspelled keyword
		const similarKeywords = DANA_KEYWORDS.filter(k => 
			levenshteinDistance(token.toLowerCase(), k.name.toLowerCase()) <= 2 && 
			token.toLowerCase() !== k.name.toLowerCase()
		);
		
		if (similarKeywords.length > 0) {
			const tokenIndex = line.indexOf(token);
			const diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Information,
				range: {
					start: { line: lineNumber, character: tokenIndex },
					end: { line: lineNumber, character: tokenIndex + token.length }
				},
				message: `Unknown token '${token}'. Did you mean '${similarKeywords[0].name}'?`,
				source: 'dana-language-server'
			};
			diagnostics.push(diagnostic);
		}
	});
}

function checkVariableDeclarations(textDocument: TextDocument, line: string, lineNumber: number, diagnostics: Diagnostic[]): void {
	// Check for var declarations without proper syntax (should be "var name is type")
	if (line.includes('var ') && !line.includes(' is ')) {
		const varIndex = line.indexOf('var ');
		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: lineNumber, character: varIndex },
				end: { line: lineNumber, character: line.length }
			},
			message: "Variable declaration must specify a type (var name is type)",
			source: 'dana-language-server'
		};
		diagnostics.push(diagnostic);
	}
	
	// Check for function definitions without proper syntax
	if (line.includes('def ') && line.includes('is ') && !line.includes(':')) {
		const defIndex = line.indexOf('def ');
		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: { line: lineNumber, character: defIndex },
				end: { line: lineNumber, character: line.length }
			},
			message: "Function definition with return type should use colon syntax (def name is returnType: params as type)",
			source: 'dana-language-server'
		};
		diagnostics.push(diagnostic);
	}
}

// Simple Levenshtein distance calculation for spell checking
function levenshteinDistance(str1: string, str2: string): number {
	const matrix: number[][] = [];
	
	for (let i = 0; i <= str2.length; i++) {
		matrix[i] = [i];
	}
	
	for (let j = 0; j <= str1.length; j++) {
		matrix[0][j] = j;
	}
	
	for (let i = 1; i <= str2.length; i++) {
		for (let j = 1; j <= str1.length; j++) {
			if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					matrix[i][j - 1] + 1,
					matrix[i - 1][j] + 1
				);
			}
		}
	}
	
	return matrix[str2.length][str1.length];
}