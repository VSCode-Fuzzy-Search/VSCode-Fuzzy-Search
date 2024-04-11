export class Matrix<T> {

    /** Internal matrix representation. */
    private _matrix: T[][];

    constructor(matrix?: T[][]) {
        this._matrix = matrix ?? [[]];
    }

    static fromRows<T>(...rows: T[]) {
        return new Matrix([rows]);
    }

    static fromCols<T>(...cols: T[]) {
        return new Matrix(cols.map(col => [col]));
    }

    /*
    [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
    ]
    */
}