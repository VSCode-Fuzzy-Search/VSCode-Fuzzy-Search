import { TreeNode } from "./TreeNode";
import { Operation } from "./Operation";

export class Search {
    node1: Array<number>;
    node2: Array<number>;
    operation: Operation;

    constructor(node1: Array<number>, node2: Array<number>, operation: Operation){
        this.node1 = node1;
        this.node2 = node2;
        this.operation = operation;
    }

    execute(): Array<number> {
        let resultantArray : Array<number> = this.operation.query(this.node1, this.node2);

        return resultantArray;
    }
}