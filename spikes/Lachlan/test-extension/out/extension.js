"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "test-extension" is now active!');
    const fileProvider = new FileProvider();
    vscode.window.registerTreeDataProvider('test-extension', fileProvider);
    vscode.commands.registerCommand('testExtension.refresh', () => fileProvider.refresh());
}
exports.activate = activate;
class FileNode extends vscode.TreeItem {
    label;
    collapsibleState;
    filePath;
    constructor(label, collapsibleState, filePath) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.filePath = filePath;
    }
    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'file.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'file.svg')
    };
    contextValue = 'file';
}
class DirectoryNode extends vscode.TreeItem {
    label;
    collapsibleState;
    directoryPath;
    filePaths;
    constructor(label, collapsibleState, directoryPath, filePaths) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.directoryPath = directoryPath;
        this.filePaths = filePaths;
    }
    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'folder.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'folder.svg')
    };
    contextValue = 'directory';
}
class FileProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!vscode.workspace.rootPath) {
            vscode.window.showInformationMessage('No workspace opened');
            return [];
        }
        if (element) {
            const directoryNode = element;
            const childNodes = directoryNode.filePaths.map(filePath => {
                const isDirectory = fs.statSync(filePath).isDirectory();
                if (isDirectory) {
                    const directoryName = path.basename(filePath);
                    const subFilePaths = fs.readdirSync(filePath).map(subFileName => path.join(filePath, subFileName));
                    return new DirectoryNode(directoryName, vscode.TreeItemCollapsibleState.Collapsed, filePath, subFilePaths);
                }
                else {
                    const fileName = path.basename(filePath);
                    return new FileNode(fileName, vscode.TreeItemCollapsibleState.None, filePath);
                }
            });
            return childNodes;
        }
        else {
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map