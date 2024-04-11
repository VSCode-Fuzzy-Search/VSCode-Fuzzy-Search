import { LateInit } from "../util/LateInit";

export class Document {

    /**
     * The raw text content of the document.
     */
    protected _content: string;

    /**
     * The content of the document - this is expressed as a matrix of:
     * - The document's vocabulary (a set of unique terms in the document).
     * - The frequency of each term in the document.
     * This effectively acts as our 'bag of words' model.
     */
    private _vocabularyMapping: LateInit<WordMapping> = new LateInit(this.processVocabulary.bind(this));

    /**
     * Create a new document.
     * @param content The raw text content of the document.
     */
    constructor(content: string = '') {
        this._content = content;
    }

    /**
     * Set the content of the document.
     */
    protected set content(value: string) {
        this._content = value;
        this._vocabularyMapping.markDirty();
    }

    /**
     * Get the content of the document.
     */
    public get content(): string {
        return this._content;
    }

    /**
     * Get the term frequency of the document, computing it if this is the first time.
     * If the term does not exist in the document, the frequency is 0.
     */
    public getFrequency(term: string): number {
        return this._vocabularyMapping.value.get(term.toLowerCase())?.frequency || 0;
    }

    /**
     * Get the vocabulary of the document.
     */
    public get vocabulary(): ReadonlyArray<string> {
        return Array.from(this._vocabularyMapping.value.keys());
    }

    /**
     * Get the vocabulary matrix of the document.
     */
    public get vocabularyMapping(): WordMapping {
        return this._vocabularyMapping.value;
    }

    /**
     * Process the vocabulary of the document and return a mapping of those terms to their frequency.
     */
    private processVocabulary(): WordMapping {
        const vocabularyMatrix = new Map<string, WordMappingData>();

        this._content
        .match(/(\w+([^ ]\w+)?)/g)  // Match all words in the document (ignoring punctuation and whitespace).
        ?.forEach((word, index) => {
                
                // Get the word mapping data for the word, creating it if it doesn't exist.
                const wordData = vocabularyMatrix.get(word.toLowerCase()) ?? { frequency: 0, positions: new Set() };
    
                // Increment the frequency of the word.
                wordData.frequency++;
    
                // Add the position of the word in the document.
                wordData.positions.add(index);
    
                // Update the word mapping.
                vocabularyMatrix.set(word.toLowerCase(), wordData);
        });

        return vocabularyMatrix;
    }
}

export type WordMapping = Map<string, WordMappingData>;
export type WordMappingData = {
    frequency: number;
    positions: Set<number>;
};
