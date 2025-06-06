import { minWeightAssign } from "munkres-algorithm";

const result = minWeightAssign([
    [10, 20, 2340, 40, 234],
    [2034, 943, 50, 50, 100],
    [2034, 943, 50, 50, 100],
    [2034, 943, 50, 50, 100],
    [2034, 943, 50, 50, 100]
])

console.log(result)