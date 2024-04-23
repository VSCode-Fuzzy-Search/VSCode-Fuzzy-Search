declare interface String {
    shuffles(): string[];
    ngrams(n: number): string[];
    isWord(): boolean;
}

declare interface StringConstructor {
    toLowerCase(string: string): string;
}