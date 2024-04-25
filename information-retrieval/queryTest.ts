import { QueryHandler } from "./QueryHandler";
import { AlgorithmEnum } from "./algorithm/AlgorithmEnum";

let queryHandler = new QueryHandler();

let result = queryHandler.handleQuery("Hello AND Bye", AlgorithmEnum.Boolean);

console.log(result);

let result2 = queryHandler.handleQuery("Hello AND Goodbye", AlgorithmEnum.Boolean);

console.log(result2);