import {match} from '../../../src/util/regexp.js';


const NAME = 'match';


describe(NAME, () => {

    it('is function', () => {
        expect(match).toBeInstanceOf(Function);
    });

    it('has name set', () => {
        expect(match).toHaveProperty('name', NAME);
    });

    it('uses default RegExp for nil `re` parameter', () => {

        const source = '(?:)';
        const expected = {flags: '', re: new RegExp(source), source};

        expect(match()).toMatchObject(expected);
        expect(match(void 0)).toMatchObject(expected);
        expect(match(null)).toMatchObject(expected);

    });


    it('returns nothing found for nil `str` parameter', () => {

        const s1 = null;

        expect(match(null, s1)).toMatchObject({
            bgn:     0, end: 0, matched: 0,
            matches: [], named: {}, numbered: [],
            input:   '', str: s1,
        });

        const s2 = void 0;

        expect(match(null, s2)).toMatchObject({
            bgn:     0, end: 0, matched: 0,
            matches: [], named: {}, numbered: [],
            input:   '', str: s2,
        });

    });

    it('returns as expected for the most trivial call', () => {

        expect(match()).toEqual({
            bgn:     0, end: 0,
            str:     void 0, input: '',
            re:      new RegExp(''), source: '(?:)', flags: '',
            matched: 0, matches: [], named: {}, numbered: [],
        });

    });

    it('matches a word', () => {

        const s = 'asdf';
        const source = '\\w+';
        const re = new RegExp(source);

        expect(match(re, s)).toEqual({
            bgn:   0, end: 0, matched: 1,
            input: s, str: s, matches: [s], numbered: [s],
            named: {}, source, re, flags: '',
        });

    });

});
