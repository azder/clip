import error$ from '../lib/error.js';
import {array, join4} from '../util/array.js';
import {defn$, fixn$} from '../util/function.js';
import lexer from './lexer.js';
import parser from './parser.js';


const avjoin = join4(' ');

const TAG = 'clip$';

export default defn$(
    TAG,

    (options = {}) => {

        options = {error$: error$(options.unwind), ...options};

        const l$ = fixn$(TAG, options.log$, TAG);

        // remove the 2 paths from parsing
        const [node, script, ...argv] = array(options.argv);

        if (argv.length) {
            options.input = avjoin(argv);
        } else {
            l$('()', 'no options.argv, using options.input');
        }

        const parsed = parser({
            ...options,
            lex:  lexer({...options, log$: l$}),
            log$: l$,
            node,
            script,
        });


        return parsed.ast;

    },
);


