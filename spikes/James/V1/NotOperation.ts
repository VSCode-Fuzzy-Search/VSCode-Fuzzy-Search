import { Operation } from "./Operation";

export class NotOperation extends Operation {

    // node 2 is the array that the doc should not be in.
    query(node1: Array<number>, node2: Array<number>): Array<number> {
        let answer: Array<number> = [];
        let node1_index: number = 0;
        let node2_index: number = 0;

        if (node2.length == 0) {
            return node1;
        }

        while (node1_index < node1.length && node2_index < node2.length){

            if (node1[node1_index] == node2[node2_index]){
                node1_index += 1;
                node2_index += 1;
            }

            else if (node1[node1_index] < node2[node2_index]){
                answer.push(node1[node1_index]);
                node1_index += 1;
            }
            else {
                node2_index += 1;
            }

        }

        if (node1_index < node1.length){
            let slice : Array<number> = node1.slice(node1_index, node1.length)

            answer = answer.concat(slice);
        }

            return answer;
    }

}