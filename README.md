# Dana Language Support for VS Code

This extension provides syntax highlighting and language support for the Dana programming language.

## Features

- **Syntax Highlighting**: Full syntax highlighting for Dana language files (`.dana`)
- **Code Completion**: IntelliSense support for keywords, built-in functions, and identifiers
- **Diagnostics**: Real-time error detection and reporting
- **Hover Information**: Documentation on hover for built-in functions and keywords
- **Code Snippets**: Pre-defined code snippets for common Dana constructs
- **Comment Support**: Line comments (`#`) and block comments (`(* ... *)`)
- **Auto-closing**: Automatic closing of brackets, quotes, and parentheses
- **Indentation**: Smart indentation based on Dana language structure
- **Code Folding**: Fold/unfold code blocks for better navigation
- **Custom File Icons**: Dana files display with a distinctive icon

## Language Features Supported

### Keywords
- **Control Flow**: `if`, `elif`, `else`, `loop`, `begin`, `end`
- **Statements**: `skip`, `exit`, `return`, `break`, `continue`
- **Definitions**: `def`, `decl`, `var`
- **Types**: `int`, `byte`, `ref`
- **Operators**: `and`, `not`, `or`, `as`, `is`
- **Booleans**: `true`, `false`

### Built-in Functions
- **I/O Functions**: `writeInteger`, `writeByte`, `writeChar`, `writeString`
- **Input Functions**: `readInteger`, `readByte`, `readChar`, `readString`
- **String Functions**: `strlen`, `strcmp`, `strcpy`, `strcat`
- **Array Functions**: `extend`, `shrink`

### Operators
- **Assignment**: `:=`
- **Comparison**: `=`, `<>`, `<`, `>`, `<=`, `>=`
- **Arithmetic**: `+`, `-`, `*`, `/`, `%`
- **Logical**: `!`, `&`, `|`

### Literals
- **Numbers**: Integer literals (e.g., `42`, `123`)
- **Characters**: Character literals with escape sequences (e.g., `'a'`, `'\n'`, `'\x41'`)
- **Strings**: String literals with escape sequences (e.g., `"Hello"`, `"Line\n"`)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AntonisAk/Dana_vscode_extension.git
   cd Dana_vscode_extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install vsce (VS Code Extension Manager):**
   ```bash
   npm install -g vsce
   ```

4. **Package the extension:**
   ```bash
   vsce package
   ```

5. **Install the .vsix file:**
   ```bash
   code --install-extension dana-language-support-1.0.0.vsix
   ```

## Usage

Simply open any file with the `.dana` extension, and the syntax highlighting will be automatically applied.

### Code Snippets

Type these prefixes and press Tab to expand:
- `def` - Function definition template
- `main` - Main function template  
- `var` - Variable declaration
- `if` - If statement
- `ifelse` - If-else statement
- `loop` - Loop with break condition
- `ws` - writeString output
- `wi` - writeInteger output

### Commands

- **Insert Main Function**: `Ctrl+Alt+M` - Quickly insert a main function template
