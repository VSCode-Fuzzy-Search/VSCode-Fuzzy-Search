export abstract class Operation {
    constructor(){}

    abstract query(node1: Array<number>, node2: Array<number>): Array<number>
}