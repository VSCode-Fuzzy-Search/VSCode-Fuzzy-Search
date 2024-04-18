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