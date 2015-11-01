import {cleanRanges} from '../clean-ranges';

describe('Clean Ranges', function() {

    it('should merge all duplicate \'same value, same type\' ranges', function(){

        var ranges = [
            { name: 'fontWeight', value: '700', start: 8, end: 13  },
            { name: 'fontWeight', value: '700', start: 10, end: 35 },
            { name: 'fontWeight', value: '700', start: 5, end: 8   },
            { name: 'fontWeight', value: '700', start: 40, end: 45 },
            { name: 'fontWeight', value: '300', start: 36, end: 39 }
        ];

        var cleanedRanges = cleanRanges(ranges);
        var expectedRanges = [
            { name: 'fontWeight', value: '700', start: 5, end: 35  },
            { name: 'fontWeight', value: '300', start: 36, end: 39 },
            { name: 'fontWeight', value: '700', start: 40, end: 45 }
        ];

        expect(cleanedRanges).to.deep.equal(expectedRanges);
    });

});