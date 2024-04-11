import { LateInit } from "../util/LateInit";

/**
 * A class representing a vector.
 * 
 * @see https://villains.fandom.com/wiki/Vector_Perkins
 */
export class Vector {

    public values: number[] = new Proxy([], {
        set: (target: number[], prop, value) => {

            if (typeof prop !== 'number') throw new Error('Invalid index.');

            target[prop] = value;

            this._magnitude.markDirty() // Mark magnitude as dirty when values are modified.

            return true;
        }
    });

    private _magnitude: LateInit<number> = new LateInit(() => Vector.processMagnitude(this));

    constructor(values: number[] = []) {
        this.values = values;
    }

    public get(index: number): number {
        return this.values[index];
    }

    public cosineSimilarity(other: Vector): number {
        return this.dot(other) / (this.magnitude * other.magnitude);
    }

    public dot(other: Vector): number {
        return this.values.reduce((acc, val, i) => acc + val * other.values[i], 0);
    }

    public get magnitude(): number {
        return this._magnitude.value;
    }

    public static from(iter: Iterable<number>): Vector {
        return new Vector(Array.from(iter));
    }

    private static processMagnitude(vec: Vector): number {
        return Math.sqrt(vec.values.reduce((acc, val) => acc + val * val, 0));
    }

    public static fill(length: number, value: number = 0): Vector {
        return new Vector(Array(length).fill(value));
    }
}

