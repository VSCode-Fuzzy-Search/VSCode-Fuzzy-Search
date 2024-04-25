

interface RetrievalAlgorithm {

    processQuery(query: string, index: unknown): {file: string, related: number}[]

    createIndex(path: string): unknown

}

export { RetrievalAlgorithm }