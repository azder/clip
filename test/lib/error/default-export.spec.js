import error$ from '../../../src/lib/error.js';


describe('error$ default export', () => {

    it('is function', () => {
        expect(error$).toBeInstanceOf(Function);
    });

    it('has name set', () => {
        expect(error$).toHaveProperty('name', 'errorConfigurator');
    });

    it('returns error$ function when called without arguments', () => {
        const actual = error$();
        expect(actual).toBeInstanceOf(Function);
        expect(actual).toHaveProperty('name', 'error$');
    });

    it('returns error$ function when called with options', () => {
        const actual = error$({unwind: true});
        expect(actual).toBeInstanceOf(Function);
        expect(actual).toHaveProperty('name', 'error$');
    });

});
