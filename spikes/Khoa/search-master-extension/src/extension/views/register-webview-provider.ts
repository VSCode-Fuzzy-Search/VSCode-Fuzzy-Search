import { CancellationToken, commands, ExtensionContext, OutputChannel, ProgressLocation, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window, workspace } from "vscode";
import { openBrowser } from "../features/register-callback-request";
import { getNonce } from "../util";
import { CenterPanel } from "./register-center-panel";

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
                case "btn-first": {
                    openBrowser();
                    break;
                }
                case 'btn-second': {
                    this.extensionContext.globalState.update('searchmasterCacheKey', data.value);
                    window.showInformationMessage('Value saved in cache: ' + data.value);
                    break;
                }
                case 'btn-third': {
                    this.extensionContext.secrets.store('searchmasterCacheKey', data.value);
                    window.showInformationMessage('Value saved in SecretStorage: ' + data.value);
                    break;
                }
                case "btn-fourth": {
                    CenterPanel.getInstance(this.extensionContext.extensionUri, this.extensionContext);
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(webview: Webview) {
        const styleResetUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "css", "reset.css"));
        const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "js", "infinite-poc-panel.js"));
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
              <button type="button" class="btn-second">Vector Space Model</button><br>
              <button type="button" class="btn-third">Language Model</button><br>
              <button type="button" class="btn-fourth">Fuzzy search</button><br>
              <script nonce="${nonce}" src="${scriptUri}"></script>
           </body>
        </html>`;
    }
}