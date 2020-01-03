import {string} from './string.js';

export const defn$ = (

    (name, fn) => {
        Object.defineProperty(fn, 'name', {value: name});
        return fn;
    }

);


// eslint-disable-next-line no-unused-vars
export const noop = defn$('noop', (...$$) => void 0);
export const ident = defn$('ident', a => a);

export const func = (fn => 'function' === typeof fn ? fn : noop);

export const fix$ = ((fn, ...args) => func(fn).bind(null, ...args));

export const fixn$ = (
    (name, fn, ...args) => {
        fn = func(fn);
        return defn$(`${fn.name}::${name}`, fix$(fn, ...args));
    }
);

export const K = defn$(
    'K',

    k => defn$(null === k ? 'K(null)' : `K(${string(k)})`, () => k),
);


