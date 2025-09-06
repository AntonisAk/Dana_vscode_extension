# Dana Language Support for VS Code

This extension provides syntax highlighting and language support for the Dana programming language.

## Features

- **Syntax Highlighting**: Full syntax highlighting for Dana language files (`.dana`)
- **Comment Support**: Line comments (`#`) and block comments (`(* ... *)`)
- **Auto-closing**: Automatic closing of brackets, quotes, and parentheses
- **Indentation**: Smart indentation based on Dana language structure

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

1. **Install vsce (VS Code Extension Manager):**
   ```bash
   npm install -g vsce
   ```

2. **Package the extension:**
   ```bash
   cd Dana_vscode_extension
   vsce package
   ```

3. **Install the .vsix file:**
   ```bash
   code --install-extension dana-language-support-1.0.0.vsix
   ```

## Usage

Simply open any file with the `.dana` extension, and the syntax highlighting will be automatically applied.

## Example

```dana
def main
    var x is int
    begin
        x := 42
        writeString: "Hello, Dana!"
        writeInteger: x
    end
```

## Contributing

This extension was created based on the Dana compiler project. For issues or contributions, please refer to the main Dana compiler repository.
