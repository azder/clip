import T from '../../etc/token.js';
import {copy, enarray, flatMap, last, lastn$, map, push$} from '../../util/array.js';
import {defn$, func, ident} from '../../util/function.js';
import {ass$, object, values} from '../../util/object.js';
import {string} from '../../util/string.js';
import {CSEP, OSEP} from '../conf.js';
import {bfl, btr, cmd, num, str} from './opts.js';

const opath = (

    (path, aka) => {
        const ps = path.split('.');
        ps.pop();
        ps.push(aka);
        return ps.join('.');
    }

);


const akas = (

    $ => [
        $,
        ...map(
            a => ({...$, path: opath($.path, a)}),
            enarray($.akas),
        ),
    ]

);


const toksOf = (

    ($ = {}) => {
        const [c, o] = string($.path).split(OSEP);
        const cmds = c.split(CSEP);
        cmds.shift(); // first is '', remove it, will not be in cli
        const tks = cmds.flatMap(w => [T.wrd, w]);
        // ons.unshift(...parent);
        if (o) {
            tks.push(1 === o.length ? T.min : T.dbl, o);
        }
        return tks;
    }

);


// const toksOf = (
//
//     ($ = {}) => {
//
//         const [cmd, opt] = string($.path).split(OSEP);
//
//         if (opt) {
//             return push$([], 1 === opt.length ? T.min : T.dbl, opt);
//         }
//
//         const segments = cmd.split(CSEP);
//         segments.shift(); // first is '', remove it, will not occur in cli
//         return segments.flatMap(w => [T.wrd, w]);
//
//     }
//
// );

const addtoks$ = (

    $ => ass$($, {toks: toksOf($)})

);

const reduce = (
    $ => {

        $ = addtoks$($);

        const cmds = flatMap(reduce, values($.cmds));
        const opts = map(addtoks$, flatMap(akas, values($.opts)));

        return [$, ...cmds, ...opts];
    }
);


const grule = (

    $ => {

        const _ = void 0;
        const toks = copy($.toks);
        const act$ = func($.type); // TODO: deal with noop
        const name = string($.name);
        const path = string($.path);

        if (ident === act$) {
            return {name, path, on: toks, act$: cmd};
        }

        if (Boolean === act$) {

            const ret = [{name, path, on: toks, act$: btr}];

            if (1 < name.length) {
                push$(ret, {name, path, on: [...toks, T.not], act$: bfl});
            }

            return ret;
        }


        if (String === act$) {
            return {name, path, on: [...toks, T.val, _], act$: str};
        }

        if (Number === act$) {
            return {name, path, on: [...toks, T.val, _], act$: num};
        }

        return {name, path, on: toks, act$};

    }

);


export default defn$(
    'prepare',

    cfg => (

        flatMap(
            grule, // map the cfg object to grule one
            reduce(object(cfg)), // unwind the tree structure to list
        ).filter(
            gr => gr.on.length, // filter out tokenless rules
        )
    ),
);
