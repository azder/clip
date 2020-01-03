import S from '../../src/etc/state.js';
import {keysOf} from '../helpers.js';


describe('default export', () => {

    it('is object', () => {
        expect(S).toBeDefined();
    });

    it('is frozen', () => {
        expect(S).toBeFrozen();
    });

    it('has the enumerated keys', () => {
        expect(
            keysOf(S)
        ).toEqual([
            'any', 'arg', 'dbl', 'dft', 'idt', 'mns', 'qt1', 'qt2', 'val',
        ]);
    });

    it('values are strings', () => {
        for (const v of Object.values(S)) {
            expect(v).toBeString();
        }
    });


});
