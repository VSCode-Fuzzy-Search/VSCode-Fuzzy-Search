import { commands, ExtensionContext, window } from "vscode";

export function registerCacheCommand(context: ExtensionContext) {
    registerShowCache(context);
    registerClearCache(context);
    registersearchmasterShowSecretStorage(context);
}

function registersearchmasterShowSecretStorage(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('searchmaster.show.secret.storage', async () => {
            const value = await context.secrets.get('searchmasterCacheKey');
            window.showInformationMessage('Value from SecretStorage: ' + value ?? '', '');
        })
    );
}

function registerShowCache(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('searchmaster.show.cache', async () => {
            const key = await window.showQuickPick(context.globalState.keys());
            window.showInformationMessage('Value from cache: ' + context.globalState.get<string>(key ?? '', ''));
        })
    );
}

function registerClearCache(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('searchmaster.clear.cache', async () => {
            const key = await window.showQuickPick(context.globalState.keys());
            context.globalState.update(key ?? '', undefined);
        })
    );
}
