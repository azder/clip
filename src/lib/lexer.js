import {array, devoid, enarray, flatMap} from '../util/array.js';
import {defn$, fixn$, func} from '../util/function.js';
import {ABOO, PEEK} from '../util/generator.js';
import {yearr, yevoid} from '../util/predicate.js';
import {string} from '../util/string.js';
import {scan} from './scan.js';


const TAG = 'lexer$';


// noinspection JSUnusedGlobalSymbols
export default defn$(
    TAG,

    function* lexer$({rules, input, state, log$, error$} = {}) {

        [rules, input, error$] = [array(rules), string(input), func(error$)];

        const l$ = fixn$(TAG, log$, '>', TAG);

        const state$ = (s => {
            state = string(s);
            l$('()', `switching to state:'${state}'...`);
        });
        state$(state);

        const {length} = input;
        let r = 0, c = 0, index = 0; // eslint-disable-line init-declarations, one-var

        while (index < length) {

            const [m] = scan({rules, index, input, state, log$: l$});

            if (yevoid(m)) { // TODO: add skipping of undefined when index<length
                l$('()', 'scan fail for:', {index, input, state, rules});
                return error$({index, row: r, col: c, char: input.charAt(index), input});
            }

            const {bgn, end, str, match, re, row, col} = m;
            [index, r, c] = [end, row, col];

            const prevst = `at: '${state}'`;
            const result = func(m.act$)({...m, index, input, rules, state, state$});

            const logres = (yearr(result) ? flatMap(string, result) : result);
            l$('()', 'act$ result:', logres, 'for re:', re, prevst);

            const ts = devoid(enarray(result));

            for (const t of ts) {
                l$('()', 'yielding:', t, 'for:', match, 'at:', bgn, '..', end);
                const token = {val: t, bgn, end, row, col, match, str};
                const back = yield token;
                if (back && back[PEEK]) {
                    l$('()', 'unshifting peek for:', back);
                    ts.unshift(back[ABOO]);
                    ts.unshift(token);
                }
            }

        } // while

        return void 0;
    },
);
