import {clean} from '../clean';

describe('Clean Ranges', function() {

    it('should merge all duplicate \'same value, same type\' ranges', function(){

        var block =
        {
            ranges: {
                fontWeight: [
                        { name: 'fontWeight', value: '700', start: 8, end: 13  },
                        { name: 'fontWeight', value: '700', start: 10, end: 35 },
                        { name: 'fontWeight', value: '700', start: 5, end: 8   },
                        { name: 'fontWeight', value: '700', start: 40, end: 45 },
                        { name: 'fontWeight', value: '300', start: 36, end: 39 }
                    ]
                }
        };

        var cleanedBlock = clean(block);
        var expectedBlock =
        {
            ranges: {
                fontWeight: [
                    { name: 'fontWeight', value: '700', start: 5, end: 35  },
                    { name: 'fontWeight', value: '300', start: 36, end: 39 },
                    { name: 'fontWeight', value: '700', start: 40, end: 45 }
                ]
            }
        };

        expect(cleanedBlock).to.deep.equal(expectedBlock);
    });

});