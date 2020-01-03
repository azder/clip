import {array, filter, first, lastn$, len, push$} from '../util/array.js';
import {defn$, fixn$, func} from '../util/function.js';
import {next$} from '../util/generator.js';
import {min} from '../util/number.js';
import {ass$, object} from '../util/object.js';
import {novoid, yearr} from '../util/predicate.js';
import {pk$} from './parse/tkpk.js';


const longer = ((grule1, grule2) => grule1.on.length > grule2.on.length);

const forward = (

    (grules, stack) => filter(
        grule => {

            const tks = array(grule.on);
            if (stack.length > tks.length) {
                return false;
            }

            const l = min(len(stack), len(tks));

            for (let i = 0; i < l; i += 1) { // eslint-disable-line init-declarations
                const {val} = object(stack[i]);
                const t = tks[i];
                if (void 0 !== t && t !== val) {
                    return false;
                }
            }

            // console.log('FTRUE', stack.map(s => s.val), tks);
            return true;

        },
        grules,
    ).sort(longer)

);


const backward = (

    (grules, stack) => filter(
        grule => {

            const tks = array(grule.on);
            if (stack.length < tks.length) {
                return false;
            }

            const slen = len(stack);
            const tlen = len(tks);

            for (let i = 1; i <= tks.length; i += 1) { // eslint-disable-line init-declarations
                const {val} = object(stack[slen - i]);
                const t = tks[tlen - i];
                if (void 0 !== t && t !== val) {
                    // console.log('FALSE', stack.map(s => s.val), tks);
                    return false;
                }
            }

            // console.log('BTRUE', stack.map(s => s.val), tks);
            return true;

        },
        grules,
    ).sort(longer)

);

const fail$ = (

    ($, t) => ass$($, {error: t instanceof Error ? t : $.err$(t)})

);

const run$ = (
    $ => {

        const {grules, lex, log$} = $;
        const l$ = fixn$('run$', log$, '>', 'run$');
        let reduced; // flag if previous cycle did reduction

        while (true) { // eslint-disable-line no-constant-condition

            const {value: t, done} = next$(lex); // TODO: don't pick next if more reduction is needed
            const endrun = !reduced && done; // so it can reduce after reduction
            reduced = false;

            if (endrun && !len($.stack)) {
                l$('()', 'parsing finished, will exit');
                return $;
            }

            if (t instanceof Error) {
                l$('()', 'token is instance of Error, will fail');
                return fail$($, t);
            }

            const stack = (novoid(t) ? push$($.stack, t) : $.stack);
            const brules = backward(grules, stack);
            const {length: blen, 0: brule} = brules;

            l$('()', 'after shift', {done, endrun, blen, brule, ast: $.ast}, stack);

            if (1 > blen && endrun) {
                l$('()', 'no matches, no more new tokens, will fail', brules);
                return fail$($, first(stack));
            }

            const p = pk$($);
            // if (1 < blen && void 0 === p.val) {
            //     l$('()', 'multiple matches, no more new tokens, will fail', brules);
            //     return fail$($, first(stack));
            // }

            const {length: flen, 0: frule} = forward(grules, [...stack, p]);
            if (0 < flen) {
                l$('()', `${flen} rules might apply, continue`);
                continue;
            }

            if (done && !stack.length) {
                l$('()', 'done and no stack left, returning');
                return $;
            }

            if (!brule && !frule && !done) {
                const token = first(stack);
                l$('()', 'syntax error: unexpected token', token);
                return fail$($, token);
            }

            // console.log({ done, reduced, endrun, stack});
            l$('()', 'first rule applies', {blen, brules, on: brule.on, flen, frule, ast: $.ast}, stack);

            const tokens = lastn$(array(object(t).on).length, stack);
            const result = brule.act$({...$, ...brule, tokens});

            if (novoid(result)) {
                $.stack = (
                    yearr(result)
                        ? push$(stack, ...result)
                        : push$(stack, result)
                );
                reduced = true;
            }

            l$('()', 'end of loop', {flen, frule, ast: $.ast}, stack);

        }

    }
);


const TAG = 'parser$';

export default defn$(
    TAG,

    ({grules, lex, log$, error$} = {}) => { // eslint-disable-line arrow-body-style


        log$ = fixn$(TAG, log$, '>', TAG);
        // log$('()', grules);
        // return [...options.lex].map($ => $.val);

        return run$({
            err$:  func(error$),
            ast:   {
                options: {},
                command: '',
                canonic: {},
            },
            stack: [],
            grules,
            log$,
            lex,
        });

    },
);

