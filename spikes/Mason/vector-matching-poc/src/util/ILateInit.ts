export interface ILateInit<T> {
    readonly value: T;
    readonly isDirty: boolean;
    markDirty(): void;
    addDependency(dependency: ILateInit<unknown>): void;
    addDependencies(dependencies: ILateInit<unknown>[]): void;
    readonly dependencies: ReadonlyArray<ILateInit<unknown>>;
}