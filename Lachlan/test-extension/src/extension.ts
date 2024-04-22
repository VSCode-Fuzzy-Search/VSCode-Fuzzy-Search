import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "test-extension" is now active!');

	const fileProvider = new FileProvider();
	vscode.window.registerTreeDataProvider('test-extension', fileProvider);
	vscode.commands.registerCommand('testExtension.refresh', () => fileProvider.refresh());
}

class FileNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly filePath: string
	) {
		super(label, collapsibleState);
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'file.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'file.svg')
	}

	contextValue = 'file';
}

class DirectoryNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly directoryPath: string,
		public readonly filePaths: string[]
	) {
		super(label, collapsibleState);
	}

	iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'folder.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'folder.svg')
    };

    contextValue = 'directory';
}

class FileProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

	async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        if (!vscode.workspace.rootPath) {
            vscode.window.showInformationMessage('No workspace opened');
            return [];
        }

        if (element) {
            const directoryNode = element as DirectoryNode;
            const childNodes = directoryNode.filePaths.map(filePath => {
                const isDirectory = fs.statSync(filePath).isDirectory();
                if (isDirectory) {
                    const directoryName = path.basename(filePath);
                    const subFilePaths = fs.readdirSync(filePath).map(subFileName => path.join(filePath, subFileName));
                    return new DirectoryNode(directoryName, vscode.TreeItemCollapsibleState.Collapsed, filePath, subFilePaths);
                } else {
                    const fileName = path.basename(filePath);
                    return new FileNode(fileName, vscode.TreeItemCollapsibleState.None, filePath);
                }
            });

            return childNodes;
        } else {
            const workspacePath = vscode.workspace.rootPath;
            const fileNames = await fs.promises.readdir(workspacePath);
            const filePaths = fileNames.map(fileName => path.join(workspacePath, fileName));

            const directoryNodes = filePaths.filter(filePath => fs.statSync(filePath).isDirectory()).map(directoryPath => {
                const directoryName = path.basename(directoryPath);
                const subFilePaths = fs.readdirSync(directoryPath).map(subFileName => path.join(directoryPath, subFileName));
                return new DirectoryNode(directoryName, vscode.TreeItemCollapsibleState.Collapsed, directoryPath, subFilePaths);
            });

            const fileNodes = filePaths.filter(filePath => !fs.statSync(filePath).isDirectory()).map(filePath => {
                const fileName = path.basename(filePath);
                return new FileNode(fileName, vscode.TreeItemCollapsibleState.None, filePath);
            });

            return [...directoryNodes, ...fileNodes];
        }
    }

}



// This method is called when your extension is deactivated
export function deactivate() {}
