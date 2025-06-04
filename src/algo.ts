import { maxWeightAssign, minWeightAssign } from 'munkres-algorithm'

/*const result = minWeightAssign([
    [108, 125, 150, Infinity, Infinity, Infinity],
    [150, 135, 175, Infinity, Infinity, Infinity],
    [122, 148, 250, Infinity, Infinity, Infinity],
])*/

const result = minWeightAssign([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
])

const assignments = result.assignments  // <- é uma função

const totalWeight = result.assignmentsWeight // <- também é uma função

console.log('Assignments:', assignments);
console.log('Total Weight:', totalWeight);

console.log(result)
