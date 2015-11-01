import {insertText} from '../insert-text';

describe('Insert Text', function() {

    it('should insert text', function(){
        var block =
        {
            blockType: 'P',
            rawText: 'My name is bob.',
            ranges: {}
        };

        var updatedBlock = insertText(block, 14, ' smith');

        var expectedBlock =
        {
            blockType: 'P',
            rawText: 'My name is bob smith.',
            ranges: {}
        };

        expect(updatedBlock.rawText).to.equal(expectedBlock.rawText);
    });

});