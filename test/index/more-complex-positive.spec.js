import clipars$ from '../../src/index.js';


describe('CLI Parser', () => {

    it('parses subcommand with options', () => {

        const configuration = (
            $ => $.c$(
                'subc',
                $ => $.o$('v').o$('option')
            )
        );

        const gr = clipars$.conf(configuration).$('rules');

        const expected = {
            canonic: {
                '/subc':        true,
                '/subc.v':      true,
                '/subc.option': true,
            },
            command: 'subc',
            options: {v: true, option: true},
        };

        gr[0].act$ = jest.fn(gr[0].act$);

        const options = {
            grules: gr,
            input:  'subc -v --option',
            unwind: true,
            // log$:   print,
        };

        expect(clipars$(options)).toEqual(expected);
        expect(gr[0].act$).toHaveBeenCalled();

    });

});
