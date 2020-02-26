import { countDisplay } from "./module";

//コンフィグ＝＝＝＝＝＝＝＝＝
export const map = {
    x:8,
    z:8,
    size: 20,
    margin: 2
}
export const rayReceiveObjects = [];
export let turn = 1;
export const pieceInfo = {
    width: map.size / 2,
    height: 6
}
export const pieceType = {
    black: 1,
    white: 2,
    max: 3
}
// export let count = {
//     black:2,
//     white:2
// }
// export let display = countDisplay(count);
//コンフィグ＝＝＝＝＝＝＝＝＝終了

//コンフィグに影響する関数＝＝＝＝＝＝＝＝＝
export function changeTurn(){
    turn = pieceType.max - turn;
}