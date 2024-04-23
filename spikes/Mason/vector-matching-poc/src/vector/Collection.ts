import fs from 'node:fs';
import { LateInit } from "../util/LateInit";
import { LateInitMap } from '../util/LateInitMap';
import { Document } from './Document';
import { DocumentPosting } from './DocumentPosting';
import { FileDocument } from './FileDocument';
import { Vector } from './Vector';

export class Collection {

    /**
     * A mapping of terms to the documents they appear in, their document frequency, and their inverse document frequency.
     * The listing of documents is stored as a mapping of documents to their term frequency, tf-idf weighting, and positions.
     */
    private _postingsList: LateInitMap<string, Posting> = new LateInitMap<string, Posting>(this.generateLateInitTermPosting);

    /**
     * Create a new collection.
     * @param _documents The documents in the collection.
     */
    constructor(private _documents: Document[] = []) {

        // Populate the postings list.
        this._documents.forEach(doc => doc.vocabulary.forEach(term => this._postingsList.set(term.toLowerCase(), this.generateLateInitTermPosting(term))));
    }

    /**
     * Set the documents in the collection.
     */
    protected set documents(value: Document[]) {
        this._documents = value;

        // Populate the postings list.
        value.forEach(doc => doc.vocabulary.forEach(term => this._postingsList.set(term.toLowerCase(), this.generateLateInitTermPosting(term))));

        this._postingsList.markDirty();
    }

    /**
     * Get the documents in the collection.
     */
    public get documents(): ReadonlyArray<Document> {
        return this._documents;
    }

    /**
     * Generate a {@link LateInit} term {@link Posting}.
     * @param term The term to generate the posting for.
     * @returns A {@link LateInit}<{@link Posting}> for the term.
     */
    private generateLateInitTermPosting(term: string): LateInit<Posting> {

        const docPostings = new LateInit(this.processPostingForDocument(term));
        const collectionFrequency = new LateInit(this.processCollectionFrequency(term));
        const invDocFrequency = new LateInit(this.processInverseDocumentFrequency(term));

        return new LateInit(() => ({
            documentPostings: docPostings,
            collectionFrequency: collectionFrequency,
            inverseDocumentFrequency: invDocFrequency
        }), [docPostings, collectionFrequency, invDocFrequency]);
    }

    /**
     * Process the postings for a document.
     * @param term The term to process the postings for.
     * @returns A function that processes the postings for the document.
     */
    private processPostingForDocument(term: string): () => DocumentPosting[] {
        return () => this._documents.map(doc => new DocumentPosting(this, doc, term.toLowerCase(), [this._postingsList]));
    }

    /**
     * Process the collection frequency of a term.
     * @param term The term to process the collection frequency for.
     * @returns A function that processes the collection frequency for the term.
     */
    private processCollectionFrequency(term: string): () => number {
        return () => this._documents.reduce((cf, doc) => cf + (doc.vocabularyMapping.has(term.toLowerCase()) ? 1 : 0), 0);
    }

    /**
     * Process the inverse document frequency of a term.
     * @param term The term to process the inverse document frequency for.
     * @returns A function that processes the inverse document frequency for the term.
     */
    private processInverseDocumentFrequency(term: string): () => number {
        return () => {
            const idf = Math.log(this._documents.length / (this._postingsList.get(term.toLowerCase())?.collectionFrequency.value ?? 1));
            return isFinite(idf) && !isNaN(idf) ? idf : 0; // Prevent NaN/Infinity.
        };
    }

    /**
     * Create a collection from a set of files.
     * @param files The files to create the collection from.
     * @returns A new collection.
     */
    static from(files?: fs.PathLike | fs.PathLike[]): Collection {
        return new Collection(
            files ?
            ([] as fs.PathLike[])
            .concat(files)
            .map(file => new FileDocument(file))
            : []
        );
    }

    /**
     * Get the postings list of the collection.
     */
    public get postingsList(): ReadonlyMap<string, Posting> {
        return this._postingsList;
    }

    /**
     * Get the collection frequency of a term.
     * @param term The term to get the collection frequency of.
     * @returns The collection frequency of the term.
     */
    public getInverseDocumentFrequency(term: string): number {
        return this._postingsList.get(term.toLowerCase())?.inverseDocumentFrequency.value ?? 0;
    }

    /**
     * Get the term frequency-inverse document frequency weighting of a term in a document.
     * @param term The term to get the tf-idf of.
     * @param document The document to get the tf-idf in.
     * @returns The tf-idf of the term in the document.
     */
    public getTFIDF(term: string, document: Document): number {
        term = term.toLowerCase();
        const tfidf = this._postingsList.get(term)
        ?.documentPostings.value.find(posting => posting.document === document)
        ?.scoreTFIDF
        ?? document.getFrequency(term) * this.getInverseDocumentFrequency(term);
        return isNaN(tfidf) ? 0 : tfidf;
    }

    /**
     * Get the vector of a document.
     * @param document The document to get the vector of.
     * @returns The vector of the document.
     */
    public getVector(document: Document): Vector {
        return Vector.from(Array.from(this._postingsList.keys()).map(term => this.getTFIDF(term, document)));
    }

    /**
     * Compare two documents using cosine similarity.
     * @param document1 The first document to compare.
     * @param document2 The second document to compare.
     * @returns The cosine similarity of the two documents.
     */
    public compare(document1: Document, document2: Document): number {
        return this.getVector(document1).cosineSimilarity(this.getVector(document2));
    }

    /**
     * Compare a document to others using cosine similarity.
     * @param search The document to compare.
     * @param others The other documents to compare to.
     * @returns A map of the documents to their cosine similarity.
     */
    public similarity(search: Document, others: Document | readonly Document[]): Map<Document, number> {
        const searchVector = this.getVector(search);
        return new Map(([] as Document[])
            .concat(others)
            .map(doc => [
                doc,
                searchVector.cosineSimilarity(this.getVector(doc))
            ])
        )
    }

    /**
     * Add a document to the collection.
     * @param document The document to add.
     */
    public addDocument(document: Document): void {
        this._documents.push(document);

        // Populate the postings list.
        document.vocabulary.forEach(term => this._postingsList.set(term.toLowerCase(), this.generateLateInitTermPosting(term)));

        this._postingsList.markDirty();
    }

    /**
     * Add multiple documents to the collection.
     * @param documents The documents to add.
     */
    public addDocuments(documents: Document[]): void {
        this._documents.push(...documents);

        // Populate the postings list.
        documents.forEach(doc => doc.vocabulary.forEach(term => this._postingsList.set(term.toLowerCase(), this.generateLateInitTermPosting(term))));

        this._postingsList.markDirty();
    }
}

/**
 * A mapping of documents to their term frequency, tf-idf weighting, and positions.
 * 
 * @property documentPostings A mapping of documents to their term frequency, tf-idf weighting, and positions.
 * @property collectionFrequency The number of documents the term appears in.
 * @property inverseDocumentFrequency The inverse document frequency of the term (log(N / df), where N is the number of documents and df is the document frequency).
 */
export interface Posting {
    'documentPostings': LateInit<DocumentPosting[]>;
    'collectionFrequency': LateInit<number>;
    'inverseDocumentFrequency': LateInit<number>;
}
