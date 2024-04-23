import fs from "node:fs";
import path from "node:path";
import { LateInit } from "../util/LateInit";
import { Document } from "./Document";

/**
 * A document that is stored in a file.
 */
export class FileDocument extends Document {

    /**
     * The file path of the document.
     */
    private readonly file: fs.PathLike;

    /**
     * The file watcher that watches for changes to the file.
     * When the file is modified, the document content and metadata (and in turn other dependent values) are updated.
     */
    // @ts-expect-error - This is assigned in the constructor and used purely as a reference.
    private readonly _statWatcher: fs.StatWatcher;

    /**
     * The metadata of the document.
     *
     * @property {string} name The name of the document.
     * @property {Date} created The date the document was created.
     * @property {Date} modified The date the document was last modified.
     * @property {Date} accessed The date the document was last accessed.
     * @property {string} extension The file extension of the document.
     */
    public readonly metadata: LateInit<IFileMetadata> = new LateInit(this.computeMetadata);

    constructor(file: fs.PathLike) {
        super(fs.readFileSync(file, 'utf-8'));

        this.file = file;

        // Watch the file for changes and update the document content and metadata accordingly.
        this._statWatcher = fs.watchFile(file, (currStat, prevStat) => {

            // Mark metadata as dirty, as the file's stats have changed.
            this.metadata.markDirty();

            // Check if the file content was modified.
            // If so, update the document content, which will mark necessary dependent values as dirty.
            if (currStat.mtimeMs !== prevStat.mtimeMs) this._content = fs.readFileSync(file, 'utf-8');
        });
    }

    private computeMetadata(): IFileMetadata {
        const stats = fs.statSync(this.file);

        return {
            name      : path.basename(this.file.toString()),
            created   : stats.birthtime,
            modified  : stats.mtime,
            accessed  : stats.atime,
            extension : path.extname(this.file.toString())
        };
    }
}

/**
 * The metadata of a file.
 * 
 * @property {string} name The name of the file.
 * @property {Date} created The date the document was created.
 * @property {Date} modified The date the document was last modified.
 * @property {Date} accessed The date the document was last accessed.
 * @property {string} extension The file extension of the document.
 */
export interface IFileMetadata {
    name      : string;
    created   : Date;
    modified  : Date;
    accessed  : Date;
    extension : string;
}
