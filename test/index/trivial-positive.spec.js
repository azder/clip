import clipars$ from '../../src/index.js';


describe('CLI Parser ', () => {


    it('returns empty for the most trivial case', () => {
        const expected = {
            canonic: {}, // nothing parsed
            command: '', // no subcommand used
            options: {}, // no options passed
        };
        expect(clipars$()).toEqual(expected);
    });

    it('parses single character subcommand', () => {

        const cmd = 'a';
        const grules = clipars$.conf($ => $.c$(cmd)).$('rules');

        const expected = {
            canonic: {'/a': true},
            command: cmd,
            options: {},
        };

        const act$ = grules[0].act$ = jest.fn(grules[0].act$);
        const options = {
            grules,
            input:  cmd,
            unwind: true,
            // log$:   print,
        };

        expect(clipars$(options)).toEqual(expected);
        expect(act$).toHaveBeenCalled();

    });

    it('parses single flag', () => {

        const grules = clipars$
            .conf($ => $.o$('v'))
            .$('rules');

        const expected = {
            canonic: {'.v': true},
            command: '',
            options: {v: true},
        };

        const act$ = grules[0].act$ = jest.fn(grules[0].act$);
        const options = {
            grules,
            input:  '-v',
            unwind: true,
            // log$:   print,
        };

        expect(clipars$(options)).toEqual(expected);
        expect(act$).toHaveBeenCalled();

    });


});
