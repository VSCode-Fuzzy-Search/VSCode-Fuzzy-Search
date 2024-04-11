String.prototype.shuffles = function (this: string) {
    return this.ngrams(this.length);
}

String.prototype.ngrams = function (this: string, n: number) {
    if (n < 1 || n > this.length) throw new Error('Invalid n-gram size.');

    const ngrams = [];

    for (let i = 0; i < this.length - n + 1; i++)
        ngrams.push(this.slice(i, i + n));

    return ngrams;
}

String.prototype.isWord = function (this: string) {
    return /^\w+$/.test(this);
}

String.toLowerCase = function (string: string) {
    return string.toLowerCase();
}
