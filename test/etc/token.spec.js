import T from '../../src/etc/token.js';
import {keysOf} from '../helpers.js';


describe('default export', () => {


    it('is object', () => {
        expect(T).toBeDefined();
    });

    it('is frozen', () => {
        expect(T).toBeFrozen();
    });

    it('has the enumerated keys', () => {
        expect(keysOf(T)).toEqual(['dbl', 'min', 'not', 'set', 'val', 'wrd']);
    });

    it('values are symbols', () => {
        for (const v of Object.values(T)) {
            expect([v, typeof v]).toEqual([v, 'symbol']);
        }
    });

});
