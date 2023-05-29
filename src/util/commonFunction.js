export function sliceArray(arr, unitCount){
    let returnArray = []
    let start = 0
    let end = unitCount
    while(start <= arr.length){
        returnArray.push(arr.slice(start, end));
        start += (unitCount);
        end += (unitCount);
    }
    return returnArray;
}