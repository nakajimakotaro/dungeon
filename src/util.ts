export function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
export function rangeRandomInt(min: number, max: number): number {
    return Math.floor(rangeRandom(min, max));
}