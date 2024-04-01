import { BooleanRetrieval } from "./BooleanRetrieval";

let files : Array<string> = ['../documents/File1.txt', '../documents/File2.txt', '../documents/File3.txt'];

let query : string = "all AND other OR fifth";

let booleanRetrieval : BooleanRetrieval = new BooleanRetrieval(files);

let answer : Array<number> = booleanRetrieval.query(query);

console.log(answer);