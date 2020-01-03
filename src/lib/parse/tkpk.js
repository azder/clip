import {next$, peek$} from '../../util/generator.js';


export const tk$ = (
    ({lex}) => {
        const {value, done} = next$(lex);
        return {...value, done};
    }
);


export const pk$ = (
    ({lex}) => {
        const {value, done} = peek$(lex);
        return {...value, done};
    }
);
