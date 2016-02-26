import {removeText} from '../remove-text';

describe('Remove Text', function() {

    it('should remove text', function(){
        var block =
        {
            blockType: 'P',
            rawText: 'My name is bob smith.',
            ranges: {}
        };

        var updatedBlock = removeText(block, 20, 6);

        var expectedBlock =
        {
            blockType: 'P',
            rawText: 'My name is bob.',
            ranges: {}
        };

        expect(updatedBlock.rawText).to.equal(expectedBlock.rawText);
    });

});