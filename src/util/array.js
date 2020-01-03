import {novoid, yenil} from './predicate.js';
import {string} from './string.js';

const {isArray} = Array;


export const array = (

    arr => yenil(arr) ? [] : arr

);

export const len = (a => array(a).length);


export const copy = (

    arr => [...array(arr)]

);


export const devoid = (arr => array(arr).filter(novoid));

export const enarray = (arrOrObj => isArray(arrOrObj) ? arrOrObj : [arrOrObj]);


export const join4 = (sep => arr => array(arr).join(string(sep)));


export const first = (

    arr => array(arr)[0]

);


export const last = (

    arr => {
        const a = array(arr);
        const i = (0 < a.length ? a.length - 1 : 0);
        return a[i];
    }

);


export const concat$ = (

    (dest, what) => {
        if (Array.isArray(what)) {
            dest.push(...what);
        } else {
            dest.push(what);
        }
        return dest;
    }

);

export const remove$ = (

    (at, count, arr) => {
        arr = array(arr);
        arr.splice(at, count);
        return arr;
    }

);


export const remove = (

    (at, count, arr) => remove$(at, count, [...arr])

);


export const shift$ = (arr => array(arr).shift());


export const push$ = (

    (arr, ...items) => {
        const a = array(arr);
        a.push(...items);
        return a;
    }

);


export const push = (

    (arr, ...items) => [...array(arr), ...items]

);


export const pop$ = (

    arr => array(arr).pop()

);


export const pop = (

    last // synonym for returning last element

);


export const filter = (

    (fn, arr) => array(arr).filter(fn)

);


export const map = (

    (fn, arr) => array(arr).map(fn)

);


export const flatMap = (

    (fn, arr) => array(arr).flatMap(fn)

);


export const lastn = ((n, arr) => array(arr).slice(0 > n ? n : -n));

export const lastn$ = ((n, arr) => array(arr).splice(0 > n ? n : -n));
