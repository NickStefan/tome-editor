import {applyRange} from '../apply-range';

describe('Apply Range', function() {

    it('should add a new range to the data model', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 13}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '700', start: 27, end: 35
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 13},
            { name: 'fontWeight', value: '700', start: 27, end: 35}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should merge new ranges: new overlaps right of old', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '700', start: 14, end: 35
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 35}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should merge new ranges: new overlaps left of old', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '700', start: 5, end: 14
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 5, end: 18}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should merge new ranges: new is wholey contained in old', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '700', start: 14, end: 17
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should merge new ranges: new wholey contains old', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '700', start: 9, end: 35
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 9, end: 35}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });


});