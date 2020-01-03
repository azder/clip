import {yenil} from './predicate.js';

export const string = (s => yenil(s) ? '' : String(s));

export const storsy = (s => 'symbol' === typeof s ? s : yenil(s) ? '' : String(s));
