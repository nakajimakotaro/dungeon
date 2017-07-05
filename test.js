

function rangeRandom(min, max){
    return Math.random() * (max - min) + min;
}
function rangeRandomInt(min, max){
    return Math.floor(rangeRandom(min, max));
}
function shuffle(array) {
    for (let a = 0; a < array.length - 1; a++) {
        let b = rangeRandomInt(a, array.length);
        let tmp = array[a];
        array[a] = array[b];
        array[b] = tmp;
    }
    return array;
}

console.log(shuffle([0, 1, 2, 3]));
console.log(shuffle([0, 1, 2, 3]));
console.log(shuffle([0, 1, 2, 3]));
console.log(shuffle([0, 1, 2, 3]));
console.log(shuffle([0, 1, 2, 3]));