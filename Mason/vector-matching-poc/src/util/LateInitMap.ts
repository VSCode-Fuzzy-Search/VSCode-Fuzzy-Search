import { ILateInit } from "./ILateInit";
import { LateInit } from "./LateInit";

/**
 * Operates like {@link LateInit}, but as a map where each key maps to a LateInit instance, and the value is the value of the LateInit instance.
 */
export class LateInitMap<K, V> implements ILateInit<V>, Map<K, V> {

    private _value: Map<K, LateInit<V>> = new Map();

    constructor(private _init: (key: K) => ILateInit<V>, private _dependencies?: ILateInit<unknown>[]) { }

    //#// Map Implementation //#//
    clear(): void { this._value.clear(); }
    delete(key: K): boolean { return this._value.delete(key); }
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void { this._value.forEach((lateInit, key) => callbackfn(lateInit.value, key, this)); }
    has(key: K): boolean { return this._value.has(key); }
    set(key: K, value: V | LateInit<V>): this {
        const lateInit = value instanceof LateInit ? value : new LateInit(() => value);
        this.addDependencyEntry(key, lateInit);
        this._value.set(key, lateInit);
        return this;
    }
    public get size(): number { return this._value.size; }
    entries(): IterableIterator<[K, V]> { return this[Symbol.iterator](); }
    keys(): IterableIterator<K> { return this._value.keys(); }
    values(): IterableIterator<V> {
        const result: V[] = [];
        for (const lateInit of this._value.values()) result.push(lateInit.value);
        return result[Symbol.iterator]();
    }
    [Symbol.iterator](): IterableIterator<[K, V]> {
        const result: [K, V][] = [];
        for (const [key, lateInit] of this._value) result.push([key, lateInit.value]);
        return result[Symbol.iterator]();
    }
    [Symbol.toStringTag]: string = "LateInitMap";

    /**
     * Inherited from {@link ILateInit} but has no implementation as it is not applicable to this class.
     * 
     * @throws Error
     */
    public get value(): V {
        throw new Error("Method not implemented.");
    }

    /**
     * Gets the value for a specific key, creating the LateInit instance if it doesn't exist.
     * 
     * @param key The key to get the value for.
     * @returns The value for the key.
     */
    public get(key: K): V {
        return this._value.get(key)?.value ?? this._init(key).value;
    }

    /**
     * Checks if any of the LateInit instances are dirty.
     * 
     * @returns True if any of the LateInit instances are dirty, false otherwise.
     */
    public get isDirty(): boolean {
        return Array.from(this._value.values()).some(lateInit => lateInit.isDirty);
    }

    /**
     * Marks all LateInit instances as dirty.
     */
    public markDirty() {
        this._dependencies?.forEach(dep => dep.markDirty());
        this._value.forEach(value => value.markDirty());
    }

    /**
     * Marks a specific LateInit instance as dirty.
     * 
     * @param key The key of the LateInit instance to mark as dirty.
     */
    public markDirtyEntry(key: K) {
        this._value.get(key)?.markDirty();
    }

    public addDependency(dependent: ILateInit<unknown>): void {
        this._dependencies ??= [];
        this._dependencies.push(dependent);
    }

    public addDependencies(dependents: ILateInit<unknown>[]): void {
        this._dependencies ??= [];
        this._dependencies.push(...dependents);
    }

    /**
     * Gets the dependents for the LateInitMap instance.
     */
    public get dependencies(): ReadonlyArray<ILateInit<unknown>> {
        return this._dependencies ?? [];
    }

    /**
     * Adds a dependent to a specific LateInit instance.
     * 
     * @param key The key of the LateInit instance to add the dependent to.
     * @param dependency The dependency to add.
     */
    public addDependencyEntry(key: K, dependency: LateInit<unknown>) {
        this._value.get(key)?.addDependency(dependency);
    }

    /**
     * Adds dependents to a specific LateInit instance.
     * 
     * @param key The key of the LateInit instance to add the dependents to.
     * @param dependencies The dependencies to add.
     */
    public addDependencyEntries(key: K, dependencies: LateInit<unknown>[]) {
        this._value.get(key)?.addDependencies(dependencies);
    }

    /**
     * Gets the dependents for a specific LateInit instance.
     * 
     * @param key The key of the LateInit instance to get the dependents for.
     * @returns The dependents for the LateInit instance.
     */
    public getDependentsForKey(key: K): ReadonlyArray<ILateInit<unknown>> {
        return this._value.get(key)?.dependencies ?? [];
    }
}
