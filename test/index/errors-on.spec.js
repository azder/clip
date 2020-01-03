import T from '../../src/etc/token.js';
import clipars$ from '../../src/index.js';


describe('CLI Parser errors when', () => {

    it('has invalid input', () => {

        const grules = clipars$
            .conf($ => $.o$('v'))
            .$('rules');

        grules[0].act$ = jest.fn(grules[0].act$);

        const error$ = jest.fn(() => {
            throw new Error('test');
        });

        const options = {
            grules,
            input:  '-b',
            unwind: true,
            // log$:   print,
            error$,
        };

        expect(() => clipars$(options)).toThrow('test');

        expect(error$).toHaveBeenCalledTimes(1);
        expect(error$).toHaveBeenCalledWith({
            val: T.min,
            bgn: 1, end: 2, row: 0, col: 1,
            str: '-b', match: 'b',
        });

    });

});
