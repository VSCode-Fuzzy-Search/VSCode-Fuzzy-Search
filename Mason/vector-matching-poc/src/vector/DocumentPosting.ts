import { ILateInit } from "../util/ILateInit";
import { LateInit } from "../util/LateInit";
import { Collection } from "./Collection";
import { Document } from "./Document";

export class DocumentPosting {

    private _termFrequency: LateInit<number> = new LateInit(() => this.processTermFrequency());
    private _tf_idf: LateInit<number> = new LateInit(() => this.processTfIdf());
    private _positions: LateInit<Set<number>> = new LateInit(() => this.processPositions());

    constructor(private _collection: Collection, private _document: Document, private _term: string, dependants?: ILateInit<unknown>[]) {
        if (dependants && dependants.length > 0) {
            this._termFrequency.addDependencies(dependants);
            this._tf_idf.addDependencies(dependants);
            this._positions.addDependencies(dependants);
        }
    }

    public get termFrequency(): number {
        return this._termFrequency.value;
    }

    public get inverseDocumentFrequency(): number {
        return this._collection.getInverseDocumentFrequency(this._term);
    }

    public get scoreTFIDF(): number {
        return this._tf_idf.value;
    }

    public get positions(): Set<number> {
        return this._positions.value;
    }

    public markDirty() {
        this._termFrequency.markDirty();
        this._tf_idf.markDirty();
        this._positions.markDirty();
    }

    public static markDirty(posting: DocumentPosting) {
        posting.markDirty();
    }

    private processTermFrequency(): number {
        return this._document.getFrequency(this._term);
    }

    private processTfIdf(): number {
        return this._termFrequency.value * this._collection.getInverseDocumentFrequency(this._term);
    }

    private processPositions(): Set<number> {
        return this._document.vocabularyMapping.get(this._term)?.positions ?? new Set();
    }
}