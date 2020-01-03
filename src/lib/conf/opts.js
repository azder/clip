import {last, lastn$} from '../../util/array.js';
import {defn$} from '../../util/function.js';
import {string} from '../../util/string.js';
import {CSEP} from '../conf.js';

export const cmd = defn$('command', ({ast, path}) => {

    path = string(path);

    ast.canonic[path] = true;
    ast.command = path.split(CSEP).join(' ').trim();

    return void 0;

});

export const btr = defn$('bool-true', ({ast, name, path, tokens}) => {

    path = string(path);
    name = string(name);

    ast.canonic[path] = true;
    ast.options[name] = true;

    lastn$(2, tokens); // eslint-disable-line no-magic-numbers

    return tokens;
});

export const bfl = defn$('bool-false', ({ast, name, path, tokens}) => {

    path = string(path);
    name = string(name);

    ast.canonic[path] = false;
    ast.options[name] = false;

    lastn$(3, tokens); // eslint-disable-line no-magic-numbers

    return tokens;

});

export const str = defn$('string', ({ast, name, path, tokens}) => {

    path = string(path);
    name = string(name);

    const token = last(tokens);
    const val = string(token.val);

    lastn$(4, tokens); // eslint-disable-line no-magic-numbers

    ast.canonic[path] = val;
    ast.options[name] = val;

    // console.log('STRING', ast, token, val, tokens);

    return tokens;
});

export const num = defn$(
    'num',
    (...tks) => Number(last(tks)), // TODO: better parse for numbers
);
