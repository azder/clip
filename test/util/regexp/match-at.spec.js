import {matchAt} from '../../../src/util/regexp.js';


const NAME = 'matchAt';
const STICKY = 'y';


describe(NAME, () => {

    it('is function', () => {
        expect(matchAt).toBeInstanceOf(Function);
    });

    it('has name set', () => {
        expect(matchAt).toHaveProperty('name', NAME);
    });


    it('uses 0 for nil `at` parameter', () => {

        const expected = {bgn: 0, end: 0};

        expect(matchAt()).toMatchObject(expected);
        expect(matchAt(void 0)).toMatchObject(expected);
        expect(matchAt(null)).toMatchObject(expected);

    });


    it('uses default RegExp for nil `re` parameter', () => {

        const source = '(?:)';
        const expected = {flags: STICKY, re: new RegExp(source, STICKY), source};

        expect(matchAt(0,)).toMatchObject(expected);
        expect(matchAt(0, void 0)).toMatchObject(expected);
        expect(matchAt(0, null)).toMatchObject(expected);

    });


    it('returns nothing found for nil `str` parameter', () => {

        const s1 = null;

        expect(matchAt(0, null, s1)).toMatchObject({
            bgn:     0, end: 0, matched: 0,
            matches: [], named: {}, numbered: [],
            input:   '', str: s1,
        });

        const s2 = void 0;

        expect(matchAt(0, null, s2)).toMatchObject({
            bgn:     0, end: 0, matched: 0,
            matches: [], named: {}, numbered: [],
            input:   '', str: s2,
        });

    });

    it('returns as expected for the most trivial call', () => {

        expect(matchAt()).toEqual({
            bgn:     0, end: 0,
            str:     void 0, input: '',
            re:      new RegExp('', STICKY), source: '(?:)', flags: STICKY,
            matched: 0, matches: [], named: {}, numbered: [],
        });

    });

    it('returns as expected for well defined input', () => {

        const str = 'a';
        const source = '[a-zA-Z][a-zA-Z-]*';
        const flags = STICKY;
        const re = new RegExp(source, flags);

        expect(matchAt(0, source, str)).toEqual({
            str, re, source, flags,
            bgn:     0, end: str.length, input: str,
            matched: 1, matches: [str], named: {}, numbered: [str],
        });

    });

    it('matches a word', () => {

        const s = 'asdf';
        const end = s.length;
        const source = '\\w+';
        const re = new RegExp(source, STICKY);

        expect(matchAt(0, re, s)).toEqual({
            bgn:   0, end, matched: 1,
            input: s, str: s, matches: [s], numbered: [s],
            named: {}, source, re, flags: STICKY,
        });

    });


    it('matches after a word', () => {

        const prefix = 'asdf';
        const word = 'fdsa';
        const str = `${prefix}${word}`;

        const bgn = prefix.length;
        const end = str.length;

        const source = '\\w+';
        const re = new RegExp(source, STICKY);

        const expected = {
            bgn, end,
            matched: 1,
            input:   str, str, matches: [word], numbered: [word],
            named:   {}, source, re, flags: STICKY,
        };

        expect(matchAt(bgn, re, str)).toEqual(expected);

    });

});
