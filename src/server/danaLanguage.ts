// Dana Language Definitions
// This file contains the language constructs for the Dana programming language

export interface DanaKeyword {
	name: string;
	description: string;
	kind: 'keyword' | 'type' | 'operator' | 'boolean';
	usage?: string;
}

export interface DanaBuiltinFunction {
	name: string;
	description: string;
	parameters: string[];
	returnType: string;
	usage: string;
}

// Dana Keywords
export const DANA_KEYWORDS: DanaKeyword[] = [
	// Control Flow
	{ name: 'if', description: 'Conditional statement', kind: 'keyword', usage: 'if condition: ... elif condition: ... else: ...' },
	{ name: 'elif', description: 'Else-if conditional', kind: 'keyword', usage: 'elif condition: ...' },
	{ name: 'else', description: 'Else clause', kind: 'keyword', usage: 'else: ...' },
	{ name: 'loop', description: 'Loop statement', kind: 'keyword', usage: 'loop: ... break' },
	{ name: 'begin', description: 'Begin block', kind: 'keyword', usage: 'begin ... end' },
	{ name: 'end', description: 'End block', kind: 'keyword' },
	
	// Statements
	{ name: 'skip', description: 'Skip statement (no operation)', kind: 'keyword' },
	{ name: 'exit', description: 'Exit from procedure', kind: 'keyword' },
	{ name: 'return', description: 'Return from function', kind: 'keyword', usage: 'return: value' },
	{ name: 'break', description: 'Break from loop', kind: 'keyword', usage: 'break or break: label' },
	{ name: 'continue', description: 'Continue to next iteration', kind: 'keyword' },
	
	// Definitions
	{ name: 'def', description: 'Function/procedure definition', kind: 'keyword', usage: 'def name is returnType: params as type' },
	{ name: 'var', description: 'Variable declaration', kind: 'keyword', usage: 'var name is type' },
	{ name: 'is', description: 'Type declaration keyword', kind: 'keyword', usage: 'var x is int' },
	{ name: 'as', description: 'Parameter type keyword', kind: 'keyword', usage: 'param as type' },
	
	// Types
	{ name: 'int', description: 'Integer type', kind: 'type', usage: 'var x is int' },
	{ name: 'byte', description: 'Byte type (also used for characters)', kind: 'type', usage: 'var x is byte' },
	{ name: 'ref', description: 'Reference parameter modifier', kind: 'keyword', usage: 'param as ref int' },
	
	// Operators
	{ name: 'and', description: 'Logical AND operator', kind: 'operator', usage: 'condition1 and condition2' },
	{ name: 'or', description: 'Logical OR operator', kind: 'operator', usage: 'condition1 or condition2' },
	{ name: 'not', description: 'Logical NOT operator', kind: 'operator', usage: 'not condition' },
	{ name: 'mod', description: 'Modulo operator', kind: 'operator', usage: 'a mod b' },
	
	// Booleans
	{ name: 'true', description: 'Boolean true value', kind: 'boolean' },
	{ name: 'false', description: 'Boolean false value', kind: 'boolean' },
	
	// Main
	{ name: 'main', description: 'Main program entry point', kind: 'keyword', usage: 'def main' },
	
	// Booleans
	{ name: 'true', description: 'Boolean true value', kind: 'boolean' },
	{ name: 'false', description: 'Boolean false value', kind: 'boolean' }
];

// Dana Built-in Functions
export const DANA_BUILTIN_FUNCTIONS: DanaBuiltinFunction[] = [
	// I/O Functions
	{
		name: 'writeInteger',
		description: 'Write an integer to output',
		parameters: ['value as int'],
		returnType: 'void',
		usage: 'writeInteger: 42'
	},
	{
		name: 'writeByte',
		description: 'Write a byte to output',
		parameters: ['value as byte'],
		returnType: 'void',
		usage: 'writeByte: 65'
	},
	{
		name: 'writeChar',
		description: 'Write a character to output',
		parameters: ['value as byte'],
		returnType: 'void',
		usage: 'writeChar: \'A\''
	},
	{
		name: 'writeString',
		description: 'Write a string to output',
		parameters: ['str as byte[]'],
		returnType: 'void',
		usage: 'writeString: "Hello"'
	},
	
	// Input Functions
	{
		name: 'readInteger',
		description: 'Read an integer from input',
		parameters: [],
		returnType: 'int',
		usage: 'x := readInteger()'
	},
	{
		name: 'readByte',
		description: 'Read a byte from input',
		parameters: [],
		returnType: 'byte',
		usage: 'b := readByte()'
	},
	{
		name: 'readChar',
		description: 'Read a character from input',
		parameters: [],
		returnType: 'byte',
		usage: 'c := readChar()'
	},
	{
		name: 'readString',
		description: 'Read a string from input',
		parameters: ['size as int', 'buffer as byte[]'],
		returnType: 'void',
		usage: 'readString: 100, buffer'
	},
	
	// String Functions
	{
		name: 'strlen',
		description: 'Get the length of a string',
		parameters: ['str as byte[]'],
		returnType: 'int',
		usage: 'len := strlen(str)'
	},
	{
		name: 'strcmp',
		description: 'Compare two strings',
		parameters: ['str1 as byte[]', 'str2 as byte[]'],
		returnType: 'int',
		usage: 'result := strcmp(s1, s2)'
	},
	{
		name: 'strcpy',
		description: 'Copy a string',
		parameters: ['dest as byte[]', 'src as byte[]'],
		returnType: 'void',
		usage: 'strcpy: dest, src'
	},
	{
		name: 'strcat',
		description: 'Concatenate two strings',
		parameters: ['dest as byte[]', 'src as byte[]'],
		returnType: 'void',
		usage: 'strcat: dest, src'
	}
];

// Dana Operators
export const DANA_OPERATORS = [
	':=', '=', '<>', '<', '>', '<=', '>=',
	'+', '-', '*', '/', 'mod', 'div',
	'and', 'or', 'not'
];

// Get all completion items (keywords + built-in functions)
export function getAllCompletionItems(): Array<{name: string, kind: string, detail: string, documentation: string}> {
	const items: Array<{name: string, kind: string, detail: string, documentation: string}> = [];
	
	// Add keywords
	DANA_KEYWORDS.forEach(keyword => {
		items.push({
			name: keyword.name,
			kind: keyword.kind,
			detail: `${keyword.kind}: ${keyword.name}`,
			documentation: keyword.usage ? `${keyword.description}\n\nUsage: ${keyword.usage}` : keyword.description
		});
	});
	
	// Add built-in functions
	DANA_BUILTIN_FUNCTIONS.forEach(func => {
		const params = func.parameters.join(', ');
		items.push({
			name: func.name,
			kind: 'function',
			detail: `${func.name}(${params}): ${func.returnType}`,
			documentation: `${func.description}\n\nUsage: ${func.usage}`
		});
	});
	
	return items;
}

// Get hover information for a symbol
export function getHoverInfo(symbol: string): {content: string, isMarkdown: boolean} | null {
	// Check keywords
	const keyword = DANA_KEYWORDS.find(k => k.name === symbol);
	if (keyword) {
		let content = `**${keyword.name}** (${keyword.kind})\n\n${keyword.description}`;
		if (keyword.usage) {
			content += `\n\n**Usage:** \`${keyword.usage}\``;
		}
		return { content, isMarkdown: true };
	}
	
	// Check built-in functions
	const func = DANA_BUILTIN_FUNCTIONS.find(f => f.name === symbol);
	if (func) {
		const params = func.parameters.join(', ');
		let content = `**${func.name}**(${params}): ${func.returnType}\n\n${func.description}\n\n**Usage:** \`${func.usage}\``;
		return { content, isMarkdown: true };
	}
	
	return null;
}