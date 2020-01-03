import rules from './etc/rules.js';
import clip$ from './lib/clip.js';
import conf from './lib/conf.js';
import {defn$} from './util/function.js';
import {ass$} from './util/object.js';


export default defn$(
    'CLI Parser',

    ass$(
        options => clip$({rules, ...options}),
        {conf},
    ),
);
