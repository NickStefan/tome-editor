import {updateRanges} from '../update-ranges';

describe('Update Ranges', function(){
	it('should update ranges on text insertion', function(){

        var fontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 13}
        ];

        var expectedFontWeightRanges = [
            { name: 'fontWeight', value: '700', start: 11, end: 20}
        ];

       var newFontWeightRanges = updateRanges(fontWeightRanges, 14, 6);

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
})