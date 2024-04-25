(function () {
    const vscode = acquireVsCodeApi();

    document.getElementById(ELEMENT_IDS.TRIGGER_MESSAGE_BUTTON).addEventListener('click', ()=> {
        let searchInput = document.getElementById(ELEMENT_IDS.SEARCH_INPUT);
        vscode.postMessage({ 
            action: POST_MESSAGE_ACTION.SHOW_WARNING_LOG, 
            data: {
                message: "Searching.....",
                input: searchInput
        }});
    });


}());
