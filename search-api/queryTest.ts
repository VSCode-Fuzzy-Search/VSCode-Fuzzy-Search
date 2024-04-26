import { QueryHandler } from "./QueryHandler";
import { AlgorithmEnum } from "./algorithm/AlgorithmEnum";

let queryHandler = new QueryHandler("C:\\Users\\james\\OneDrive\\Documents\\Monash 2024 Semester 1\\FIT4002\\Repo\\VSCode-Fuzzy-Search\\James\\extension\\fuzzysearch\\src\\files");

let result = queryHandler.handleQuery("Hello AND Bye", AlgorithmEnum.Boolean);

console.log(result);

let result2 = queryHandler.handleQuery("Hello AND Goodbye", AlgorithmEnum.Boolean);

console.log(result2);