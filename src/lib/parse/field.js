import {string} from '../../util/string.js';
import {object} from '../../util/object.js';
import {yenil} from '../../util/predicate.js';
import {array} from '../../util/array.js';


export const fldOf = field => {

    field = string(field);

    return (({cfg, val}) => {

        cfg = object(cfg);
        val = string(val);

        const map = object(cfg[field]);
        const direct = map[val];

        if (direct) {
            return direct;
        }

        for (const key of Object.keys(map)) {

            const indirect = map[key];

            if (yenil(indirect)) {
                continue;
            }

            const akas = array(indirect.akas);

            if (akas.includes(val)) {
                return indirect;
            }

            if (akas.includes(`no-${val}`)) {
                return indirect;
            }

        }

        return void 0;

    });

};

export const cmdOf = fldOf('cmds');
export const optOf = fldOf('opts');
