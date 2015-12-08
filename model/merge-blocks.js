import {updateRanges} from './update-ranges';
import {clean} from './clean';

function mergeBlocks (blocks, blockIndexA, blockIndexB){
    var blockA = blocks[blockIndexA];
    var blockB = blocks[blockIndexB];

    var blockARanges = JSON.parse(JSON.stringify(blockA.ranges));
    var blockBRanges = updateRanges(JSON.parse(JSON.stringify(blockB.ranges)), 0, blockB.rawText.length);

    // merge blockBranges into blockAranges
    var newRanges = Object.keys(blockBRanges)
    .reduce(function(blockARanges, key){
        var rangeArray = blockARanges[key] || [];
        blockARanges[key] = rangeArray.concat( blockBRanges[key] );
        return blockARanges;
    }, blockARanges || {});

    var newBlock = clean({
        blockType: blockA.blockType,
        rawText: blockA.rawText + blockB.rawText,
        ranges: newRanges
    });

    blocks.splice(blockIndexA, 2, newBlock);

    return blocks;
}

export default mergeBlocks;
export {mergeBlocks};