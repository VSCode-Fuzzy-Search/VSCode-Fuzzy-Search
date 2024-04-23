import { Operation } from "./Operation";

export class AndOperation extends Operation {

    query(node1: Array<number>, node2: Array<number>): Array<number> {
        let answer: Array<number> = [];
        let node1_index: number = 0;
        let node2_index: number = 0;

        if (node1.length === 0 || node2.length === 0){
            
            return [];
        }

        while (node1_index < node1.length && node2_index < node2.length){

            if (node1[node1_index] == node2[node2_index]){
                answer.push(node1[node1_index])
                node1_index += 1;
                node2_index += 1;
            }

            else if (node1[node1_index] < node2[node2_index]){
                node1_index += 1;
            }
            else {
                node2_index += 1;
            }

        }

            return answer;
    }

}