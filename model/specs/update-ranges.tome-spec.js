import {updateRanges} from '../update-ranges';

describe('Update Ranges', function(){
	it('should update ranges on text insertion', function(){

        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 13}
        ];

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 19}
        ];

       var newFontWeightRanges = updateRanges(fontWeightRanges, 12, 6);

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should update ranges on text deletion', function(){

        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 13}
        ];

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 12}
        ];

       var newFontWeightRanges = updateRanges(fontWeightRanges, 13, -1);

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });

    it('should remove ranges when text deletion creates a \'negative range\'', function(){

        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 13}
        ];

        var expectedFontWeightRanges = [];

       var newFontWeightRanges = updateRanges(fontWeightRanges, 13, -10);

        expect(newFontWeightRanges).to.deep.equal(expectedFontWeightRanges);
    });
})