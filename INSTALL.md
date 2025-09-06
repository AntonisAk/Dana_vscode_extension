# Dana VS Code Extension Setup Instructions

## Installation

### Option 1: Local Installation (Recommended for Development)

1. **Install dependencies:**
   ```bash
   cd dana-vscode-extension
   npm install
   ```

2. **Compile the extension:**
   ```bash
   npm run compile
   ```

3. **Install the extension locally:**
   - Press `F5` in VS Code to open a new Extension Development Host window
   - OR copy the entire `dana-vscode-extension` folder to:
     - **Windows**: `%USERPROFILE%\.vscode\extensions\`
     - **macOS**: `~/.vscode/extensions/`
     - **Linux**: `~/.vscode/extensions/`

4. **Reload VS Code** and open any `.dana` file to test the syntax highlighting.

### Option 2: Package and Install

1. **Install vsce (VS Code Extension Manager):**
   ```bash
   npm install -g vsce
   ```

2. **Package the extension:**
   ```bash
   cd dana-vscode-extension
   vsce package
   ```

3. **Install the .vsix file:**
   ```bash
   code --install-extension dana-language-support-1.0.0.vsix
   ```

## Testing

1. Open any `.dana` file from your Dana compiler project
2. You should see syntax highlighting for:
   - Keywords (blue): `def`, `if`, `begin`, `end`, etc.
   - Types (green): `int`, `byte`, `ref`
   - Strings (orange): `"Hello World"`
   - Comments (gray): `# This is a comment` and `(* block comment *)`
   - Numbers (blue): `42`, `123`
   - Built-in functions (yellow): `writeString`, `readInteger`, etc.

## Customization

You can modify the colors and styling by editing the `syntaxes/dana.tmLanguage.json` file and adjusting the scope names to match your preferred VS Code theme.

## Troubleshooting

- If syntax highlighting doesn't appear, make sure the file has a `.dana` extension
- Check the VS Code Output panel (View → Output → Select "Extensions") for any error messages
- Reload VS Code after making changes to the extension files
