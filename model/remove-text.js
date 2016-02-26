
import {updateRanges} from './update-ranges';

function removeText(block, index, length){

    var rawTextArr = block.rawText.split('');
    rawTextArr.splice(index - length, length);

    var ranges = {};
    for (var key in block.ranges){
        ranges[key] = updateRanges(block.ranges[key], index, -length);
    }

    block.ranges = ranges;
    block.rawText = rawTextArr.join('');
    return block;
}

export default removeText;
export {removeText};