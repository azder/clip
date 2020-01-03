import lexer from '../../../src/lib/lexer.js';

const GeneratorFunction = (
    // eslint-disable-next-line no-empty-function
    function* dummy() {
    }
).constructor;


describe('default export', () => {

    it('is generator function', () => {
        expect(lexer).toBeFunction();
        expect(lexer).toBeInstanceOf(GeneratorFunction);
    });

    it('has name set', () => {
        expect(lexer).toHaveProperty('name', 'lexer$');
    });

    it('cannot be used with null', () => {
        // noinspection JSCheckFunctionSignatures
        expect(() => lexer(null)).toThrow();
    });

    it('returns undefined and done for the most trivial call', () => {
        const actual = lexer().next();
        const expected = {value: void 0, done: true};
        expect(actual).toEqual(expected);
    });

    it('returns undefined and done for trivial options object', () => {
        const actual = lexer({}).next();
        const expected = {value: void 0, done: true};
        expect(actual).toEqual(expected);
    });

    describe('with options', () => {

        it('returns undefined for empty string `input`', () => {
            const actual = lexer({input: ''}).next();
            const expected = {value: void 0, done: true};
            expect(actual).toEqual(expected);
        });

        it('returns result from `error$` on fail', () => {

            const input = 'abcd';
            const error$ = jest.fn(a => a);

            const options = {input, error$};
            const expected = {input, char: 'a', index: 0, col: 0, row: 0};

            const lex = lexer(options);
            const i1 = lex.next(); // init and get first item
            const i2 = lex.next(); // will not make a difference

            expect(i1).toEqual({done: true, value: expected});
            expect(i2).toEqual({done: true, value: void 0});

            expect(error$.mock.calls.length).toBe(1);
            expect(error$.mock.results[0].value).toEqual(expected);

        });

        it('uses `log$` with proper tags', () => {

            const log$ = jest.fn((a, b) => `${a}${b}`);

            const options = {input: 'abcd', log$};

            expect(
                // init and get first item
                lexer(options).next()
            ).toEqual(
                // no rules, will return undefined
                {done: true, value: void 0}
            );

            expect(log$.mock.calls.length).toBeGreaterThan(0);

            for (const {value} of log$.mock.results) {
                expect(value).toEqual('>lexer$');
            }

        });

    });

    describe('with `rules` from options', () => {

        it('skips when `act$` is missing', () => {

            expect(lexer({
                input: 'ab cd ef',
                rules: [{re: /\s+/}, {re: /\w+/}],
            }).next()).toEqual({
                done:  true,
                value: void 0,
            });

            expect(lexer({
                input: 'ab cd ef',
                rules: [{re: /\s+/, act$: a => a}, {re: /\w+/}],
            }).next()).toMatchObject({
                done:  false,
                value: {match: ' '},
            });

            expect(lexer({
                input: ' ab cd ef',
                rules: [{re: /\s+/}, {re: /\w+/, act$: a => a}],
            }).next()).toMatchObject({
                done:  false,
                value: {match: 'ab'},
            });

            expect([
                ...lexer({
                    input: ' abc 123 ',
                    rules: [
                        {re: /\s+/},
                        {re: /[a-z]+/, act$: ({match}) => `w:${match}`},
                        {re: /[0-9]+/, act$: ({match}) => `n:${match}`},
                    ],
                }),
            ]).toMatchObject([
                {match: 'abc', val: 'w:abc'},
                {match: '123', val: 'n:123'},
            ]);

        });

        it('skips when `st` is different', () => {

            const s0 = 's0';
            const s1 = 's1';
            const s2 = 's2';

            expect(lexer({
                state: s0,
                input: 'ab cd ef',
                rules: [
                    {st: s1, re: /\s+/, act$: a => a},
                    {st: s2, re: /\w+/, act$: a => a},
                ],
            }).next()).toEqual({
                done:  true,
                value: void 0,
            });

            // error$ gets invoked when /\s+/ act$ returns undefined
            expect(lexer({
                state: s2,
                input: ' ab cd ef',
                rules: [
                    {st: s1, re: /\s+/, act$: a => a},
                    {st: s2, re: /\w+/, act$: ({state, match}) => `${state}:${match}`},
                ],
            }).next()).toEqual({
                done:  true,
                value: void 0,
            });


            expect(lexer({
                state: s2,
                input: 'ab cd ef',
                rules: [
                    {st: s1, re: /\s+/, act$: a => a},
                    {st: s2, re: /\w+/, act$: ({state, match}) => `${state}:${match}`},
                ],
            }).next()).toMatchObject({
                done:  false,
                value: {match: 'ab', val: 's2:ab'},
            });

            expect([
                ...lexer({
                    state: s1,
                    input: ' abc 123',
                    rules: [
                        {st: s0, re: /\w+/, act$: ({state}) => state},
                        {st: s1, re: /\s+/, act$: ({state}) => state},
                        {st: s1, re: /[a-z]+/, act$: ({state}) => state},
                        {st: s1, re: /[0-9]+/, act$: ({state}) => state},
                    ],
                }),
            ]).toMatchObject([
                {match: ' ', val: s1},
                {match: 'abc', val: s1},
                {match: ' ', val: s1},
                {match: '123', val: s1},
            ]);

        });

        it('returns matched words separated by space', () => {

            const a = 'word1';
            const b = 'word2';
            const s = ' ';
            const input = `${a}${s}${b}`;
            const act$ = $ => $;
            const rules = [{re: /\s+/, act$}, {re: /\w+/, act$}];

            const lex = lexer({input, rules}); // init the lexer

            // first word match
            expect(lex.next()).toMatchObject({
                done:  false,
                value: {
                    row:   0,
                    col:   0,
                    bgn:   0,
                    end:   a.length,
                    match: a,
                    str:   input,
                },
            });

            // space between words match
            expect(lex.next()).toMatchObject({
                done:  false,
                value: {
                    row:   0,
                    col:   a.length,
                    bgn:   a.length,
                    end:   a.length + 1,
                    match: s,
                    str:   input,
                },
            });

            // second word match
            expect(lex.next()).toMatchObject({
                done:  false,
                value: {
                    row:   0,
                    col:   a.length + s.length,
                    bgn:   a.length + s.length,
                    end:   input.length,
                    match: b,
                    str:   input,
                },
            });

        });

    });

});
