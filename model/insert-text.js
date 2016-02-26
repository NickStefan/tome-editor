
import {updateRanges} from './update-ranges';

function insertText(block, index, charsToInsert){

    var rawTextArr = block.rawText.split('');
    rawTextArr.splice(index, 0, charsToInsert);

    var ranges = {};
    for (var key in block.ranges){
        ranges[key] = updateRanges(block.ranges[key], index, charsToInsert.length);
    }

    block.ranges = ranges;
    block.rawText = rawTextArr.join('');
    return block;
}

export default insertText;
export {insertText};