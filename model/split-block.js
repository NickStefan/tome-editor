import {updateBlockRanges} from './update-ranges';
import {clean} from './clean';

function splitBlock (blocks, blockIndex, charIndex){
    var blockToSplit = blocks[blockIndex];

    var oldBlockText = blockToSplit.rawText.slice(0, charIndex);
    var newBlockText = blockToSplit.rawText.slice(charIndex);

    var oldBlockRanges = updateBlockRanges(JSON.parse(JSON.stringify(blockToSplit.ranges)), blockToSplit.rawText.length, -newBlockText.length);
    var newBlockRanges = updateBlockRanges(JSON.parse(JSON.stringify(blockToSplit.ranges)), charIndex, -charIndex);

    var oldBlock = clean({
        blockType: blockToSplit.blockType,
        rawText: oldBlockText,
        ranges: oldBlockRanges
    });

    var newBlock = clean({
        blockType: blockToSplit.blockType,
        rawText: newBlockText,
        ranges: newBlockRanges
    });

    blocks.splice(blockIndex, 1, oldBlock, newBlock);

    return blocks;
}

export default splitBlock;
export {splitBlock};