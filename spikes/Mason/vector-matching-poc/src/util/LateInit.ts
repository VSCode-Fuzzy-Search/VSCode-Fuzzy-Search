import { ILateInit } from "./ILateInit";

export class LateInit<T> implements ILateInit<T> {
    private _value?: T;
    private _dirty = true;

    constructor(private _init: () => T, private _dependencies: ILateInit<unknown>[] = []) { }

    get value() {
        // If the value has been marked as dirty, cause it to be recomputed.
        if (this._dirty) {
            this._value = undefined;
            this._dirty = false;
        }

        return this._value ??= this._init();
    }

    public markDirty() {
        this._dependencies.forEach(dep => dep.markDirty());
        this._dirty = true;
    }

    public get isDirty(): boolean {
        return this._dirty;
    }

    public addDependency(dependency: ILateInit<unknown>) {
        this._dependencies.push(dependency);
    }

    public addDependencies(dependencies: ILateInit<unknown>[]) {
        dependencies.forEach(dep => this.addDependency(dep));
    }

    public get dependencies(): ReadonlyArray<ILateInit<unknown>> {
        return this._dependencies;
    }
}
