import { commands, ExtensionContext, window } from 'vscode';
import { registerCacheCommand } from './extension/features/cache-operation';
import { registerWelcomeMessage } from './extension/features/register-welcome-message';
import { registerCenterPanel } from './extension/views/register-center-panel';
import { registerWebViewProvider } from "./extension/views/register-webview-provider";

export function activate(context: ExtensionContext) {
	const op = window.createOutputChannel('InfinitePOC');
	registerCacheCommand(context);
	registerWelcomeMessage(context);
	registerWebViewProvider(context, op);
	registerCenterPanel(context);
	commands.executeCommand('setContext', 'isPrintContextMenu', true);
}

export function deactivate() { }
