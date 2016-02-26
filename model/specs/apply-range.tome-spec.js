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

    it('should shrink conflicting old range, that overlapps new range, on left', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '500', start: 14, end: 35
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 14},
            { name: 'fontWeight', value: '500', start: 14, end: 35}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should shrink conflicting old range, that overlapps new range, on right', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '500', start: 5, end: 14
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 14, end: 18},
            { name: 'fontWeight', value: '500', start: 5, end: 14}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should split old ranges when new is wholey contained in old', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '300', start: 14, end: 17
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 14},
            { name: 'fontWeight', value: '700', start: 17, end: 18},
            { name: 'fontWeight', value: '300', start: 14, end: 17}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should remove old ranges: new wholey contains old', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '300', start: 9, end: 35
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '300', start: 9, end: 35}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should leave exactly duplicate same value ranges, and leave them for clean', function(){
        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        var newFontWeightRanges = applyRange(fontWeightRanges, {
            name: 'fontWeight', value: '700', start: 11, end: 18
        });

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 18},
            { name: 'fontWeight', value: '700', start: 11, end: 18}
        ];

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });


});