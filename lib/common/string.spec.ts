import {expect} from 'chai';
import {capitalize} from './string';

describe('common.string', () => {

    describe('capitalize', () => {

        it('should capitalize specified string', () => {
            expect(capitalize('test')).to.equal('Test');
        });

    });
});
