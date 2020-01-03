import {yenil} from './predicate.js';
import {storsy, string} from './string.js';

export const ass$ = Object.assign;

export const object = (

    o => yenil(o) ? {} : o

);

export const prop = (

    key => o => object(o)[string(key)]

);


export const prop4 = (

    key => o => object(o)[storsy(key)]

);


export const keys = (

    o => Object.keys(object(o))

);


export const values = (

    o => Object.values(object(o))

);
