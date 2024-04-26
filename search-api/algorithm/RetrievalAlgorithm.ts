import * as fs from 'fs';

abstract class RetrievalAlgorithm { //abstract 

    abstract processQuery(query: string, index: unknown): {file: string, related: number}[]

    abstract createIndex(path: string): unknown

    getDocuments(path: string): unknown {

        let files: Array<string> = fs.readdirSync(path);

        let fileWords: {[docID: string]: Array<string>} = {}

        for (let i = 0; i < files.length; i++){

            if (fs.lstatSync(path + "\\" + files[i]).isFile()){
                let fileOutput: string = fs.readFileSync(path + "\\" + files[i], 'utf-8');
            
                let fileSplit: Array<string> = fileOutput.replace(/[(),'.:]/g, "").replace("[", "").replace("]", "").split(" ");

                fileWords[files[i]] = fileSplit;
            }

        }

        return fileWords
    }

}

export { RetrievalAlgorithm }