import fs from 'node:fs';
import { LateInit } from "../util/LateInit";
import { LateInitMap } from '../util/LateInitMap';
import { Document } from './Document';
import { DocumentPosting } from './DocumentPosting';
import { FileDocument } from './FileDocument';

export class Collection {

    /** The documents in the collection. */
    private _documents: Document[];

    /**
     * A mapping of terms to the documents they appear in, their document frequency, and their inverse document frequency.
     * The listing of documents is stored as a mapping of documents to their term frequency, tf-idf weighting, and positions.
     */
    private _postingsList: LateInitMap<string, Posting> = new LateInitMap<string, Posting>(this.generateLateInitTermPosting);

    constructor(documents: Document[]) {

        Object.defineProperty(this, '_documents', {
            writable: true,
            set: (value: Document[]) => {

                // Update the documents.
                this._documents = value;

                // Mark the postings list as dirty.
                this._postingsList.markDirty();
            }
        });

        this._documents = documents;
    }

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

    private processPostingForDocument(term: string): () => DocumentPosting[] {
        return () => this._documents.map(doc => new DocumentPosting(this, doc, term, [this._postingsList]));
    }

    private processCollectionFrequency(term: string): () => number {
        return () => this._documents.reduce((df, doc) => df + (doc.vocabularyMapping.has(term) ? 1 : 0), 0);
    }

    private processInverseDocumentFrequency(term: string): () => number {
        return () => Math.log(this._documents.length / (this._postingsList.get(term)?.collectionFrequency.value ?? 1));
    }

    static from(files: fs.PathLike | fs.PathLike[]): Collection {
        return new Collection(
            ([] as fs.PathLike[])
            .concat(files)
            .map(file => new FileDocument(file))
        );
    }

    public get postingsList(): ReadonlyMap<string, Posting> {
        return this._postingsList;
    }

    public getInverseDocumentFrequency(term: string): number {
        return this._postingsList.get(term)?.inverseDocumentFrequency.value ?? 0;
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
