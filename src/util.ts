import json5 = require("json5");

export namespace Util {
    export function rangeRandom(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    export function rangeRandomInt(min: number, max: number): number {
        return Math.floor(rangeRandom(min, max));
    }
    export function range(range: number) {
        return new Array(range).fill(0).map((e, i) => i);
    }
    export function randomSelectArray<T>(array: Array<T>) {
        return array[rangeRandomInt(0, array.length)];
    }
    export function randomSelect<T, K>(map: Map<T, K>) {
        return map.get(map.keys[rangeRandomInt(0, map.size)]);
    }
    export async function getJson5(url: string) {
        return json5.parse(await new Promise((resolve) => {
            const require = new XMLHttpRequest();
            require.open("GET", url);
            require.addEventListener("loadend", () => {
                resolve(require.responseText);
            })
            require.send();
        }) as string);
    }
}