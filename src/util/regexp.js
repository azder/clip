import {devoid} from './array.js';
import {yenil} from './predicate.js';
import {string} from './string.js';


const STICKY = 'y';


export const match = (

    (re, str) => {

        re = (yenil(re) ? new RegExp('') : RegExp(re));

        const s = string(str);
        const result = re.exec(s) || [];

        const numbered = s ? Array.from(result) : [];
        const matches = devoid(numbered);
        const matched = matches.length;

        const {index: bgn, input} = result;
        const {lastIndex: end, source, flags} = re;
        const named = result.groups || Object.create(null);

        return {re, str, source, flags, input, bgn, end, named, numbered, matched, matches};
    }

);


export const matchAt = (

    (at, re, str) => {

        at = (yenil(at) ? 0 : at); // default to start if missing
        re = (yenil(re) ? new RegExp('') : RegExp(re));

        const flags = (
            // must have the sticky flag for lastIndex to take effect
            re.flags.includes(STICKY)
                ? re.flags
                : `${re.flags}${STICKY}`
        );

        re = RegExp(re, flags); // as to not change the original
        re.lastIndex = at;

        return match(re, str);

    }

);







