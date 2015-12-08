import {updateRanges} from './update-ranges';

function splitBlock (blocks, blockIndex, charIndex){
    var blockToSplit = blocks[indexToSplit];

    var oldBlockText = blockToSplit.rawText.slice(0, charIndex);
    var newBlockText = blockToSplit.rawText.slice(charIndex);

    var oldBlockRanges = updateRanges(JSON.parse(JSON.stringify(blockToSplit.ranges)), oldBlockText.length, -newBlockText.length);
    var newBlockRanges = updateRanges(JSON.parse(JSON.stringify(blockToSplit.ranges)), charIndex, -oldBlockText.length);

    var oldBlock = {
        blockType: blockToSplit.blockType,
        rawText: oldBlockText,
        ranges: oldBlockRanges
    };

    var newBlock = {
        blockType: blockToSplit.blockType,
        rawText: newBlockText,
        ranges: newBlockRanges
    };

    blocks.splice(blockIndex, 1, oldBlock, newBlock);

    return blocks;
}

export default splitBlock;
export {splitBlock};