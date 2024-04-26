import { RetrievalAlgorithm } from "../RetrievalAlgorithm";


class TempBool extends RetrievalAlgorithm {

    processQuery(query: string, index: unknown): { file: string; related: number; }[] {

        let splitQuery = query.replace("(", "").replace(")", "").split(" ");

        let andArray = []

        for (let i = 0; i < splitQuery.length; i++){

            if (splitQuery[i] == "AND"){

                let arr1 = (index as {[word: string]: string[]})[splitQuery[i - 1]]
                let arr2 = (index as {[word: string]: string[]})[splitQuery[i + 1]]
                

                for (let j = 0; j < arr2.length; j++){
                    if (arr1.includes(arr2[j])){
                        andArray.push(arr2[j])
                    }
                }

            }

        }

        let result = []
        for (let i = 0; i < andArray.length; i++){
            result.push({file: andArray[i], related: 1})
        }
        

        return result
    }

    createIndex(path: string): unknown {

        let words = this.getDocuments(path);
        console.log(words)

        return { "Hello": ["Doc 1", "Doc 2", "Doc 3"],
            "Bye": ["Doc 2", "Doc 3"],
            "Goodbye": ["Doc 1"]
        }
    }

}

export { TempBool }