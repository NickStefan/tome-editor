import {cleanRanges} from '../clean-ranges';

describe('Clean Ranges', function() {

    it('should merge all duplicate same value ranges', function(){

        var ranges = [
            { name: 'fontWeight', value: '700', start: 8, end: 13},
            { name: 'fontWeight', value: '700', start: 10, end: 35},
            { name: 'fontWeight', value: '700', start: 5, end: 8},
            { name: 'fontWeight', value: '700', start: 37, end: 40}
        ];

        var cleanedRanges = cleanRanges(ranges);
        var expectedRanges = [
            { name: 'fontWeight', value: '700', start: 5, end: 35},
            { name: 'fontWeight', value: '700', start: 37, end: 40}
        ];

        expect(cleanedRanges).to.deep.equal(expectedRanges);
    });

});