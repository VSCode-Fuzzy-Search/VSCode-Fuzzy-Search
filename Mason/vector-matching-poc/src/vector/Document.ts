import { LateInit } from "../util/LateInit";
import { Vector } from "./Vector";

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
    private _vocabularyMapping: LateInit<WordMapping> = new LateInit(this.processVocabulary);

    constructor(content: string) {

        // Define a setter for the content property that marks the vocabulary mapping as dirty when the content is modified.
        Object.defineProperty(this, '_content', {
            writable: true,
            set: (value: string) => {
                this._content = value;
                this._vocabularyMapping.markDirty();
            }
        });

        this._content = content;
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
     * Get the vector representation of the document.
     */
    public getVector(other: Document): Vector {
        return Vector.from(other.vocabulary.map(this.getFrequency));
    }

    /**
     * Process the vocabulary of the document and return a mapping of those terms to their frequency.
     */
    private processVocabulary(): WordMapping {
        const vocabularyMatrix = new Map<string, WordMappingData>();

        this._content.split(/\s+/)
        .map(String.toLowerCase)
        .forEach((word, index) => {
                
                // Get the word mapping data for the word, creating it if it doesn't exist.
                const wordData = vocabularyMatrix.get(word.toLowerCase()) ?? { frequency: 0, positions: new Set() };
    
                // Increment the frequency of the word.
                wordData.frequency++;
    
                // Add the position of the word in the document.
                wordData.positions.add(index);
    
                // Update the word mapping.
                vocabularyMatrix.set(word, wordData);
        });

        return vocabularyMatrix;
    }
}

export type WordMapping = Map<string, WordMappingData>;
export type WordMappingData = {
    frequency: number;
    positions: Set<number>;
};
