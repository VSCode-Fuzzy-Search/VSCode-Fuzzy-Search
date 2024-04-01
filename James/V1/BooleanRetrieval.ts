import * as fs from 'fs';
import { TreeNode } from "./TreeNode";
import { Search } from "./Search";
import { AndOperation } from "./AndOperation";
import { OrOperation } from "./OrOperation";
import { NotOperation } from "./NotOperation";

export class BooleanRetrieval {

    files : Array<string>;
    index : { [id: string]: TreeNode} = {};
    
    constructor(files: Array<string>){
        this.files = files;


        for (let i = 0; i < files.length; i++){

            let fileOutput: string = fs.readFileSync(files[i], 'utf-8');
            
            let fileSplit: Array<string> = fileOutput.replace(/[(),'.:]/g, "").replace("[", "").replace("]", "").split(" ");

            for (let word of fileSplit) {

                if (this.index[word] != undefined){
                    this.index[word].insert(i + 1);
                }
                else {
                    this.index[word] = new TreeNode(i + 1);
                }

            }
        }

    }

    query(searchQuery : string) : Array<number>{
        let splitQuery = searchQuery.replace("(", "").replace(")", "").split(" ");

        let currentQuery : Array<number> = (this.index[splitQuery[0]] == undefined) ? [] : this.index[splitQuery[0]].extract();

        for (let i = 0; i < splitQuery.length; i++){


            if (splitQuery[i] == "AND"){
                let rightQuery : Array<number> = (this.index[splitQuery[i + 1]] == undefined) ? [] : this.index[splitQuery[i + 1]].extract()
                currentQuery = new Search(currentQuery, rightQuery, new AndOperation()).execute();
            }

            else if (splitQuery[i] == "OR"){
                let rightQuery : Array<number> = (this.index[splitQuery[i + 1]] == undefined) ? [] : this.index[splitQuery[i + 1]].extract()
                currentQuery = new Search(currentQuery, rightQuery, new OrOperation()).execute();
            }            

            else if (splitQuery[i] == "NOT"){
                let rightQuery : Array<number> = (this.index[splitQuery[i + 1]] == undefined) ? [] : this.index[splitQuery[i + 1]].extract()
                currentQuery = new Search(currentQuery, rightQuery, new NotOperation()).execute();
            }  

        }

        return currentQuery;
    }

}