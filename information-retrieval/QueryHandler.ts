import { AlgorithmEnum } from "./algorithm/AlgorithmEnum";
import * as fs from 'fs';
import * as vscode from 'vscode';
import { TempBool } from "./algorithm/booleanRetrieval/TempBool";

class QueryHandler {

    indexs: { [algo: number]: unknown} = {}

    QueryHandler(){

        let documents
        // if(vscode.workspace.workspaceFolders !== undefined) {

            // let path = vscode.workspace.workspaceFolders[0].uri.path.substring(1);

            let path = "C:\\Users\\james\\OneDrive\\Documents\\Monash 2024 Semester 1\\FIT4002\\Repo\\VSCode-Fuzzy-Search\\James\\extension\\fuzzysearch"

		    documents = fs.readdirSync(path);

        // }

    }

    handleQuery(query: string, algorithm: AlgorithmEnum): {file: string, related: number}[] {



        if (algorithm == 0){

            // let path = vscode.workspace.workspaceFolders[0].uri.path.substring(1);

            let path = "C:\\Users\\james\\OneDrive\\Documents\\Monash 2024 Semester 1\\FIT4002\\Repo\\VSCode-Fuzzy-Search\\James\\extension\\fuzzysearch"

            let booleanRetrieval = new TempBool()

            if (this.indexs[algorithm] == undefined){
                console.log("Making New Index")
                this.indexs[algorithm] = booleanRetrieval.createIndex(path);

            }

            let result = booleanRetrieval.processQuery(query, this.indexs[algorithm])

            return result
        }

        return [{file: "Failed", related: 0}]
        
    }
}

export { QueryHandler }