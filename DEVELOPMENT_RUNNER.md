# Development Runner

## Quick Start

The `run-dev.sh` script automatically finds the project root and starts the development server. It can be executed from any directory.

### Usage

```bash
# Make the script executable (one-time setup)
chmod +x run-dev.sh

# Run the development server (from any directory)
./run-dev.sh
```

### What it does

1. **Auto-detects project root**: Finds the closest directory containing `package.json`
2. **Searches common locations**: If not found locally, searches `~/Downloads`, `~/Projects`, `~/Workspace`, `~/Code`
3. **Prefers MindVaultIP projects**: Prioritizes directories with "MindVaultIP" in the name
4. **Interactive selection**: If multiple projects found, shows a numbered list to choose from
5. **Runs setup**: Executes `npm install` then `npm run dev`

### VS Code Integration

Use the built-in VS Code task:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Run Dev (auto-detect root)"

Or use the keyboard shortcut:
- `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac) to run the default build task

### Examples

```bash
# From project root
./run-dev.sh
# Output: Found package.json in current directory: /path/to/MindVaultIP

# From a subdirectory
cd src/components
./run-dev.sh
# Output: Found project root by walking up: /path/to/MindVaultIP

# From anywhere (if project is in Downloads)
cd ~/Desktop
./run-dev.sh
# Output: Found 1 project directories with package.json:
#   1) /Users/username/Downloads/mind-vault-ip-copy-copy-dcccaa8f (MindVaultIP project)
```

### Troubleshooting

- **"No project directories found"**: Ensure the project exists in one of the searched locations
- **Permission denied**: Run `chmod +x run-dev.sh` to make the script executable
- **npm errors**: The script will show clear error messages and exit codes

### Features

- ✅ **Portable**: Works from any directory
- ✅ **Smart detection**: Finds project root automatically
- ✅ **Interactive**: Prompts for selection when multiple projects found
- ✅ **Colored output**: Clear visual feedback with colors
- ✅ **Error handling**: Graceful error messages and exit codes
- ✅ **POSIX compliant**: Uses only standard bash tools
