import { LateInit } from "../util/LateInit";

/**
 * A class representing a vector.
 * 
 * @see https://villains.fandom.com/wiki/Vector_Perkins
 */
export class Vector {

    private _magnitude: LateInit<number> = new LateInit(() => Vector.processMagnitude(this));

    constructor(public values: number[] = []) { }

    public set(index: number, value: number): void {
        this.values[index] = value;
        this._magnitude.markDirty() // Mark magnitude as dirty when values are modified.
    }

    public get(index: number): number {
        return this.values[index];
    }

    public cosineSimilarity(other: Vector): number {
        if (this.magnitude === 0 || other.magnitude === 0) return 0; // Prevent division by zero (NaN).
        return this.dot(other) / (this.magnitude * other.magnitude);
    }

    public dot(other: Vector): number {
        return this.values.map((val, i) => val * other.values[i]).reduce((acc, val) => acc + val, 0);
    }

    public get magnitude(): number {
        return this._magnitude.value;
    }

    public static from(iter: Iterable<number>): Vector {
        return new Vector(Array.from(iter));
    }

    private static processMagnitude(vec: Vector): number {
        return Math.sqrt(vec.values.reduce((acc, val) => acc + Math.pow(val, 2), 0));
    }

    public static fill(length: number, value: number = 0): Vector {
        return new Vector(Array(length).fill(value));
    }
}

