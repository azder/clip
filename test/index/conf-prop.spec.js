import clipars$ from '../../src/index.js';
import conf from '../../src/lib/conf.js';

describe('has conf prop', () => {

    it('is function', () => {
        expect(clipars$.conf).toBeInstanceOf(Function);
    });

    it('is the same exported from the conf module', () => {
        expect(clipars$.conf).toBe(conf);
    });

});
