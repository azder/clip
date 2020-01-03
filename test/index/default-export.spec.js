import clipars$ from '../../src/index.js';


describe('CLI Parser default export', () => {

    it('is function', () => {
        expect(clipars$).toBeInstanceOf(Function);
    });

    it('has name set', () => {
        expect(clipars$).toHaveProperty('name', 'CLI Parser');
    });

});
