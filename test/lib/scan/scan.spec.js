import {scan} from '../../../src/lib/scan.js';


describe('default export', () => {

    it('is function', () => {
        expect(scan).toBeInstanceOf(Function);
    });

    it('has name set', () => {
        expect(scan).toHaveProperty('name', 'scan');
    });

    it('cannot be used with null', () => {
        // noinspection JSCheckFunctionSignatures
        expect(() => scan(null)).toThrow();
    });

    it('returns empty array for the most trivial call', () => {
        expect(scan()).toEqual([]);
    });

    it('returns empty array for trivial options object', () => {
        const options = {};
        expect(scan(options)).toEqual([]);
    });

    it('works with missing index and state options', () => {

        const {arrayContaining: ac, objectContaining: oc} = expect;

        const input = 'asdf';
        const rules = [{re: /\w+/}];

        const actual = scan({input, rules});

        const expected = ac([oc(
            {bgn: 0, end: 4, row: 0, col: 0, matches: [input]}
        )]);

        expect(actual).toEqual(expected);

    });

    it('returns single match for single word rule', () => {

        const action = (a => a);
        const input = 'abcd';
        const {length} = input;
        const source = '\\w+';
        const re = new RegExp(source);

        const actual = scan({
            state: '',
            input,
            rules: [{re, act$: [action], st: ['']}],
        });

        const expected = [
            {
                act$:     [action],
                bgn:      0,
                end:      length,
                row:      0,
                col:      0,
                source, // the source for the regex
                flags:    'y', // regex must add y flag if missing
                re, // the generated regex
                input, // the input provided as arg
                length, // the length of the input string
                match:    input,
                matched:  1, // must match a single word
                matches:  [input],
                named:    {}, // empty object because no named groups in regex
                numbered: [input],
                str:      input, // the input as the regex matcher received it
            },
        ];

        expect(actual).toEqual(expected);

    });


});
