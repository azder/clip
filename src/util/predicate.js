export const novoid = (m => void 0 !== m);
export const yevoid = (m => void 0 === m);


export const yenil = (a => null === a || void 0 === a);
export const nonil = (a => null !== a && void 0 !== a);


export const yefn = (f => 'function' === typeof f);
export const nofn = (f => 'function' !== typeof f);


const {isArray} = Array;

export const yearr = (a => isArray(a));
export const noarr = (a => !isArray(a));
