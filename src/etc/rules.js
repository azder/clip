import {K} from '../util/function.js';
import {go$, prefix$, seq$, rule} from '../util/rule.js';
import S from './state.js';
import T from './token.js';


export default Object.freeze([

    // command name
    rule({st: S.dft, re: /[a-zA-Z][a-zA-Z-]*/, act$: prefix$(T.wrd)}),
    // whitespace / command separator
    rule({st: [S.dft, S.arg], re: /\s+/}),
    // flag dash
    rule({st: [S.dft, S.val, S.arg], re: /-/, act$: go$(S.mns)}),
    // double dash
    rule({st: [S.dft, S.val, S.arg], re: /--/, act$: go$(S.dbl)}),

    // flag, double, value ender
    rule({st: [S.mns, S.dbl, S.val, S.arg], re: /\s+/, act$: go$(S.arg)}),

    // arg value
    rule({st: S.arg, re: /[^\s-'"]+/, act$: prefix$(T.val)}),

    // flag name
    rule({st: S.mns, re: /[a-zA-Z]/, act$: prefix$(T.min)}),
    // flag value
    rule({st: S.val, re: /[^-'"\s]+/, act$: prefix$(T.val)}),
    // double name
    rule({
        st:   S.dbl,
        re:   /(?<no>no-)?(?<nm>[a-zA-Z][a-zA-Z-]+)/,
        act$: ({named: {no, nm}}) => [T.dbl, nm, no ? T.not : void 0],
    }),
    // double separator
    rule({st: S.dbl, re: /[=]/, act$: seq$(go$(S.val), K(T.set))}),


    // single quote
    rule({st: [S.mns, S.val, S.dbl, S.arg], re: /'/, act$: go$(S.qt1)}),
    rule({st: S.qt1, re: /'/, act$: go$(S.arg)}),
    rule({st: S.qt1, re: /[^']*/, act$: prefix$(T.val)}),

    // double quote
    rule({st: [S.mns, S.val, S.dbl, S.arg], re: /"/, act$: go$(S.qt2)}),
    rule({st: S.qt2, re: /"/, act$: go$(S.arg)}),
    rule({st: S.qt2, re: /[^"]*/, act$: prefix$(T.val)}),

]);
