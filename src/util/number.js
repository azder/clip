export const clamp = (

    (min, max, val) => min > val ? min : max < val ? max : val

);


export const min = (

    (a, b) => a < b ? a : b

);


export const max = (

    (a, b) => a > b ? a : b

);
