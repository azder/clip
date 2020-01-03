import {devoid, enarray} from '../util/array.js';
import {ident} from '../util/function.js';
import {ass$, object} from '../util/object.js';
import {nonil, yefn} from '../util/predicate.js';
import {string} from '../util/string.js';
import prepare from './conf/prepare.js';


export const PARENT = Symbol('parent');
export const TYPE = Symbol('type');

export const CMD = 'cmd';
export const OPT = 'opt';
export const CSEP = '/';
export const OSEP = '.';

export const FORMAT_PLAIN = 'plain';
export const FORMAT_RULES = 'rules';
export const FORMAT_JSON = 'json';


const cb = (

    (fn, cfg) => {
        if (yefn(fn)) {
            fn(cfg);
        }
        return ass$(cfg, object(fn));
    }

);

const p4c = (path, name) => `${path}${CSEP}${name}`;
const p4o = (path, name) => `${path}${OSEP}${name}`;


class Conf {

    constructor({name, path, type, alias: akas, [PARENT]: p, [TYPE]: t} = {}) {
        ass$(this, {
            [PARENT]: p,
            [TYPE]:   nonil(t) ? t : CMD,
            name:     string(name),
            path:     string(path),
            akas:     devoid(enarray(akas)),
            type:     yefn(type) ? type : ident,
            opts:     {},
            cmds:     {},
        });
    }

    c$(name, options) {
        name = string(name);
        const cmd = new Conf({
            name,
            [PARENT]: this,
            [TYPE]:   CMD,
            path:     p4c(this.path, name),
        });
        this.cmds[name] = cb(options, cmd);
        return this;
    }

    o$(name, options) {
        name = string(name);
        const parent = CMD === this[TYPE] ? this : this[PARENT];
        const opt = new Conf({
            name,
            // options can't be parents of other options, only commands can
            [PARENT]: parent,
            [TYPE]:   OPT,
            path:     p4o(parent.path, name),
            // options should always have proper type constructor
            type:     yefn(options && options.type) ? options.type : Boolean,
        });
        this.opts[name] = cb(options, opt);
        return this;
    }

    $(format) {

        if (FORMAT_PLAIN === format) {
            return JSON.parse(JSON.stringify(this));
        }

        if (FORMAT_JSON === format) {
            return JSON.stringify(this);
        }

        if (FORMAT_RULES === format) {
            return prepare(this);
        }

        // TODO: deep clone
        return this;
    }

}


export default (

    options => cb(options, new Conf())

);
