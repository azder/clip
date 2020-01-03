import {noop} from './function.js';
import {enarray} from './array.js';
import {string} from './string.js';


export const seq$ = (

    (...fns$) => $ => {
        let result;
        for (const f$ of fns$) {
            result = f$($);
        }
        return result;
    }

);


export const go$ = (

    where => ({state$}) => state$(where)

);


export const emit$ = (what => () => what);


export const prefix$ = (

    (...what) => ({match}) => [...what, match]

);


export const suffix$ = (

    (...what) => ({match}) => [match, ...what]

);


export const rule = (

    ({re, act$, st}) => {

        act$ = (void 0 === act$ ? noop : act$);
        re = RegExp(re);
        st = enarray(st).map(string);

        return ({re, act$, st});

    }

);
