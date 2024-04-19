

const collection = new Collection();
const file1 = new File('Files/File1.txt');
const file2 = new File('Files/File2.txt');
const file3 = new File('Files/File3.txt');

collection.addFile(file1);
collection.addFile(file2);
collection.addFile(file3);





		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		const text = editor.document.getText(editor.selection);
        const probabilities = collection.searchCollection(text);