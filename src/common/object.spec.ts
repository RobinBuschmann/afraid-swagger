import {deepMerge} from './object';
import {expect} from 'chai';

describe('common.object', () => {

    describe('deepMerge', () => {

        it('should merge properties of obj1 and obj2', () => {
            expect(deepMerge({a: 1}, {b: 2})).to.eql({
                a: 1,
                b: 2,
            });
        });

        it('should merge nested properties of obj1 and obj2', () => {
            expect(deepMerge({nest: {a: 1}}, {nest: {b: 2}})).to.eql({
                nest: {
                    a: 1,
                    b: 2,
                }
            });
        });

        it('should merge arrays of obj1 and obj2', () => {
            expect(deepMerge({arr: [1]}, {arr: [2]})).to.eql({
                arr: [1, 2],
            });
        });

        it('should merge nested arrays of obj1 and obj2', () => {
            expect(deepMerge({nest: {arr: [1]}}, {nest: {arr: [2]}})).to.eql({
                nest: {arr: [1, 2]},
            });
        });

        it('should override prop of obj1 with prop of obj2', () => {
            expect(deepMerge({a: 1}, {a: 2})).to.eql({
                a: 2,
            });
        });

        it('should return copies of nested objects and arrays', () => {
            const obj = {obj: {}, arr: []};
            const merged = deepMerge({}, obj);
            expect(merged.obj !== obj.obj).to.be.true;
            expect(merged.arr !== obj.arr).to.be.true;
        });

    });

});
