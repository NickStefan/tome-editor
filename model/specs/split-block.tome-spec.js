import {splitBlock} from '../split-block';

describe('Split Block', function(){
    it('should split the text at the char index', function(){

        var blocks = [
            {
                blockType: 'P',
                rawText: 'My name is bob.',
                ranges: {}
            }
        ];

        var expectedBlocks = [
            {
                blockType: 'P',
                rawText: 'My name',
                ranges: {}
            },
            {
                blockType: 'P',
                rawText: ' is bob.',
                ranges: {}
            }
        ];

        expect(splitBlock(blocks, 0, 7)).to.deep.equal(expectedBlocks);
    });

    it('should correctly split the ranges at the char index', function(){

        var blocks = [
            {
                blockType: 'P',
                rawText: 'My name is bob. My name is Bob Smith',
                ranges: {
                    fontWeight: [
                        { name: 'fontWeight', value: '700', start: 11, end: 14 },
                        { name: 'fontWeight', value: '700', start: 27, end: 36 }
                    ],
                    color: [
                        { name: 'color', value: 'green', start: 11, end: 30 }
                    ],
                    fontStyle: [
                        { name: 'fontStyle', value: 'italic', start: 8, end: 15 }
                    ]
                }
            }
        ];

        var expectedBlocks = [
            {
                blockType: 'P',
                rawText: 'My name is bob.',
                ranges: {
                    fontWeight: [
                        { name: 'fontWeight', value: '700', start: 11, end: 14 }
                    ],
                    color: [
                        { name: 'color', value: 'green', start: 11, end: 15 }
                    ],
                    fontStyle: [
                        { name: 'fontStyle', value: 'italic', start: 8, end: 15 }
                    ]
                }
            },
            {
                blockType: 'P',
                rawText: ' My name is Bob Smith',
                ranges: {
                    fontWeight: [
                        { name: 'fontWeight', value: '700', start: 12, end: 21 }
                    ],
                    color: [
                        { name: 'color', value: 'green', start: 0, end: 15 }
                    ],
                    fontStyle: []
                }
            }
        ];

        expect(splitBlock(blocks, 0, 15)).to.deep.equal(expectedBlocks);

    });
});