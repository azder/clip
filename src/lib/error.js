import {remove$} from '../util/array.js';
import {defn$} from '../util/function.js';
import {clamp} from '../util/number.js';

const LF = '\n';
const OFFSET = 32;


export default defn$(
    'errorConfigurator',

    unwind => defn$(
        'error$',

        ({char, match, index, bgn, row, col, input, str}) => {

            const idx = (void 0 === index ? bgn : index);
            const chr = (void 0 === char ? match : char);
            const inp = (void 0 === input ? str : input);

            const line = inp.slice(idx - col, inp.indexOf(LF, idx));
            const len = line.length;

            const from = clamp(0, len, col - OFFSET);
            const to = clamp(0, len, col + OFFSET);

            const dots = '.'.repeat(col);
            const slice = line.slice(from, to);

            const e = new Error(
                `Unexpected '${chr}' @ ${row}:${col} ${LF}${slice}${LF}${dots}^`,
            );

            // remove stack line for this function invocation
            e.stack = remove$(3, 1, e.stack.split(LF)).join(LF); // eslint-disable-line no-magic-numbers
            if (unwind) {
                throw e;
            }
            return e;

        },
    )
);
