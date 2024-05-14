import { CancellationToken, commands, ExtensionContext, OutputChannel, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window } from "vscode";
import { getNonce } from "../util";
import { CenterPanel } from "./register-center-panel";
import * as vscode from 'vscode';

export function readSelectedOrAllText(op: OutputChannel) {
    op.clear();
    const { activeTextEditor } = window;
    let txt = '';
    if (!activeTextEditor || activeTextEditor.document.languageId !== 'javascript') {
        op.appendLine('no active found');
    } else {

        txt = activeTextEditor.document.getText(activeTextEditor.selection);
        if (!txt) txt = activeTextEditor.document.getText();
        op.appendLine(txt);
    }
    op.show();
    return txt;
}

export function registerWebViewProvider(context: ExtensionContext, op: OutputChannel) {
    const provider = new SidebarWebViewProvider(context.extensionUri, context);
    context.subscriptions.push(window.registerWebviewViewProvider('search-master-sidebar-panel', provider));

    context.subscriptions.push(commands.registerCommand('searchmaster.print.editor.menu', () => {
        const txt = readSelectedOrAllText(op);
        provider.view?.webview.postMessage({ type: 'transferDataFromTsToUi', data: txt });
    }));
}

export class SidebarWebViewProvider implements WebviewViewProvider {
    constructor(private readonly _extensionUri: Uri, public extensionContext: ExtensionContext) { }
    view?: WebviewView;

    resolveWebviewView(webviewView: WebviewView,
        webViewContext: WebviewViewResolveContext,
        token: CancellationToken) {
        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'btn-first': {
                    CenterPanel.getInstance(this.extensionContext.extensionUri, this.extensionContext);
                    break;
                }
                case 'btn-second': {
                    window.showInformationMessage('Value saved in SecretStorage: ' + data.value);
                    break;
                }                                   
                case 'btn-third': {
                    this.extensionContext.secrets.store('searchmasterCacheKey', data.value);
                    window.showInformationMessage('Value saved in SecretStorage: ' + data.value);
                    break;
                }
                case 'btn-fourth': {
                    this.extensionContext.workspaceState.update('searchmasterCacheKey', data.value);
                    window.showInformationMessage('Value saved in cache: ' + data.value);
                    break;
                }
                case 'btn-fifth': {
                    const keyword = data.value;
                    try {
                        // Await the completion of the command execution
                        await vscode.commands.executeCommand('workbench.action.findInFiles', {
                            query: keyword,
                            triggerSearch: true,
                            isCaseSensitive: false,
                            isRegex: false,
                            matchWholeWord: false,
                            filesToInclude: "**/*",  // Include all files, adjust as necessary
                            filesToExclude: "",      // Exclude no files, adjust as necessary
                            useExcludeSettingsAndIgnoreFiles: true
                        });
                        vscode.window.showInformationMessage('Search triggered with keyword: ' + keyword);
                    } catch (error) {
                        // Handle any errors that occur during the command execution
                        vscode.window.showInformationMessage('Error triggering search: ' + error);
                    }
                    break;
                }
                case 'btn-sixth': {
                    const keyword = data.value.toLowerCase();
                    // Search all text files in the first workspace folder
                    if (vscode.workspace.workspaceFolders) {
                        const searchPattern = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], '**/*.txt'); // Adjust the pattern to target specific files
                        vscode.workspace.findFiles(searchPattern).then(files => {
                            const searchResults: string[] = [];
                            files.forEach(file => {
                                vscode.workspace.openTextDocument(file).then(document => {
                                    const text = document.getText();
                                    if (text.toLowerCase().includes(keyword)) {
                                        searchResults.push(file.fsPath); // Collect matching file paths
                                        vscode.window.showInformationMessage(`Found keyword in: ${file.fsPath}`);
                                    }
                                });
                            });
                            // After processing all files, you can send these results back to your webview if necessary
                            setTimeout(() => {
                                if (searchResults.length > 0) {
                                    this.view?.webview.postMessage({
                                        type: 'displayResults',
                                        files: searchResults
                                    });
                                } else {
                                    vscode.window.showInformationMessage('No matching files found.');
                                }
                            }, 3000); // Adjust timeout as needed based on expected file counts and sizes
                        });
                    } else {
                        vscode.window.showInformationMessage('No workspace open.');
                    }
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(webview: Webview) {
        const styleResetUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "css", "reset.css"));
        const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "js", "search-master-panel.js"));
        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "css", "vscode.css"));

        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
            <head>
              <meta charset="UTF-8">
              <!--
                 Use a content security policy to only allow loading images from https or from our extension directory,
                 and only allow scripts that have a specific nonce.
                 -->
              <meta http-equiv="Content-Security-Policy"
               content="
                 img-src ${webview.cspSource}
                 style-src ${webview.cspSource}
                 script-src 'nonce-${nonce}';">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="${styleResetUri}" rel="stylesheet">
              <link href="${styleVSCodeUri}" rel="stylesheet">
              <script nonce="${nonce}"></script>
           </head>
           <body>
              <div>Search Engines</div>
              <div>Input: </div>
              <input type="text" class="txt-box" id="searchmastervalueid" name="searchmastervaluename"><br>
              <button type="button" class="btn-first">Boolean Retrieval</button><br>
              <button type="button" class="btn-second">Vector Space Model</button>
              <button type="button" class="btn-third">Language Model</button><br>
              <button type="button" class="btn-fourth">Fuzzy search</button><br>
              <button type="button" class="btn-fifth">VSCode search</button><br>
              <button type="button" class="btn-sixth">Brute Force search</button><br>
              <script nonce="${nonce}" src="${scriptUri}"></script>
           </body>
        </html>`;
    }
}