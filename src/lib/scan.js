import {array, enarray} from '../util/array.js';
import {fix$} from '../util/function.js';
import {yenil} from '../util/predicate.js';
import {matchAt} from '../util/regexp.js';
import {string} from '../util/string.js';

const ANY = '*';
const LF_S = '\n';
const LF_R = /[^\n]/g;
const NOT_FOUND = -1;
const EMPTY = '';


const rc = (

    ({bgn, str}) => {

        const sub = string(str).slice(0, bgn);
        const at = sub.lastIndexOf(LF_S);

        const row = sub.replace(LF_R, EMPTY).length;
        const col = NOT_FOUND === at ? bgn : bgn - at;

        return {row, col};
    }

);


const byLonger = (

    (a, b) => Math.sign(b.length - a.length)

);


export const scan = (

    ({rules, index, input, state, log$} = {}) => {

        index = yenil(index) ? 0 : index; // default 0 on nil
        state = yenil(state) ? '' : state; // default '' on nil

        const l$ = fix$(log$, '>', 'scan');

        const scans = []; // the result to return at the end

        array(rules).forEach(
            ({re, act$, st}) => {

                const states = enarray(st).map(string);

                // TODO: @azder: see if default state should be ANY, not ''
                if (!states.includes(ANY) && !states.includes(state)) {
                    l$('()', state, 'not in states and not any allowed, skipping...');
                    return;
                }

                const mat = matchAt(index, re, input);
                // l$('()', 'mat:', mat);
                const {matched, bgn, matches: [first]} = mat;

                if (!matched || bgn !== index) {
                    l$('()', 'no match or', bgn, '!==', index, 'skipping...');
                    return;
                }

                scans.push({...mat, ...rc(mat), match: first, length: first.length, act$});
                scans.sort(byLonger);

            },
        );

        l$('()', 'matchings:', scans.map(s => `${s.match}`));
        return scans;
    }

);
