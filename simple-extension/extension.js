// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

class File {
    constructor(path) {
        this.text = {}; // object to store word counts
        this.totalWords = 0;
        this.path = path;

        this.readFile(path);
    }

    readFile(path) {
        const fs = require('fs');
        const data = fs.readFileSync(path, 'utf8');
        const lines = data.split('\n');
        
        for (const line of lines) {
            const words = line.split(/\s+/);
            for (const word of words) {
                const w = word.toLowerCase();
                this.text[w] = (this.text[w] || 0) + 1;
                this.totalWords++;
            }
        }
    }

    getProbability(query) {
        const words = query.split(/\s+/);
        let probability = 1;

        for (const word of words) {
            probability *= this.getWordProbability(word);
        }
        return probability;
    }

    getWordProbability(word) {
        return this.text[word] ? this.text[word] / this.totalWords : 0;
    }
}

class Collection {
    constructor() {
        this.files = {};
    }

    addFile(file) {
        this.files[file.path] = file;
    }

    searchCollection(query) {
        const probabilities = {};
        for (const file of Object.values(this.files)) {
            probabilities[file.path] = file.getProbability(query);
        }
        this.printProbabilities(probabilities);
        return probabilities;
    }

    printProbabilities(probabilities) {
        for (const [file, probability] of Object.entries(probabilities)) {
            console.log(`Probability of query in ${file} is ${probability}`);
        }
    }
}

/*
const collection = new Collection();
const file1 = new File('simple-extension/Files/File1.txt');
const ficle2 = new File('simple-extension/Files/File2.txt');
const file3 = new File('simple-extension/Files/File3.txt');

collection.addFile(file1);
collection.addFile(file2);
collection.addFile(file3);
*/

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "simple-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('simple-extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed


		//editor.edit(builder => builder.replace)

		vscode.window.showInformationMessage("File1: 0.1\nFile2: 0.03\nFile3: 0.25");
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}



