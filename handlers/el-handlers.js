import {clean} from '../model/clean';
import {insertText} from '../model/insert-text';
import {removeText} from '../model/remove-text';

import {mergeBlocks} from '../model/merge-blocks';
import {splitBlock} from '../model/split-block';

function elKeydownHandler(self){
    return function(e){
        // http://www.quirksmode.org/js/keys.html

        // hot keys
        if (e.metaKey || e.ctrlKey){
            switch (e.keyCode){
                case 73: // i
                    e.preventDefault();
                    e.stopPropagation();

                    self.applyRange({name: 'fontStyle', value: 'italic'});
                    return false;

                case 66: // b
                    e.preventDefault();
                    e.stopPropagation();

                    self.applyRange({name: 'fontWeight', value: 700});
                    return false;

                case 85: // u
                    e.preventDefault();
                    e.stopPropagation();

                    self.applyRange({name: 'textDecoration', value: 'underline'});
                    return false;
            }
        }

        switch (e.keyCode) {

            // ARROWS
            case 37: // left
            case 39: // right
            case 38: // up
            case 40: // down
                break;

            case 13: // enter
                e.preventDefault();
                e.stopPropagation();

                if (e.shiftKey){
                    interceptCrossBlockChanges.call(self);
                    handleShiftEnter.call(self);
                } else {
                    interceptCrossBlockChanges.call(self);
                    handleEnter.call(self);
                }
                return false;

            case 27: // escape
            case 16: // shift
            case 18: // alt / option
            case 91: // command/meta
            case 93: // command/meta
                break;

            // case 9: // tab
                // break;
            // case ??: // fn ?
            // fn keys?

            case 46: // backspace
                e.preventDefault();
                e.stopPropagation();

                handleDelete.call(self, 46);
                return false;

            case 8:  // delete
                e.preventDefault();
                e.stopPropagation();

                handleDelete.call(self, 8);
                return false;

            // FOCUS THE HIDDEN INPUT BOX
            default:
                interceptCrossBlockChanges.call(self);
                focusInput.call(self);
        }
        return true;
    };
}

function focusInput(){
    var cursor = this.getCursor();
    if (!cursor) {
        return;
    } else {
        this.cursor = cursor;
    }

    var start = cursor.startPath.slice().pop();
    var end = cursor.endPath.slice().pop();
    var block = cursor.startPath.slice(0, -1).pop();

    this.hiddenInput.focus();
    this.hiddenInput.value = this.data.blocks[block].rawText;
    this.hiddenInput.setSelectionRange(start, end);
}

function interceptCrossBlockChanges(){
    var cursor = this.getCursor();
    if (!cursor) {
        return;
    } else {
        this.cursor = cursor;
    }

    var charStart = cursor.startPath.slice().pop();
    var charEnd = cursor.endPath.slice().pop();
    var blockStart = cursor.startPath.slice(0, -1).pop();
    var blockEnd = cursor.endPath.slice(0, -1).pop();

    if (blockStart !== blockEnd){

        // delete partially text on first outside block
        var deleteStart = this.data.blocks[blockStart].rawText.length;
        var startLength =  deleteStart - charStart;

        this.data.blocks[blockStart] = clean(removeText(this.data.blocks[blockStart], deleteStart, startLength));

        // delete partially text on last outside block
        this.data.blocks[blockEnd] = clean(removeText(this.data.blocks[blockEnd], charEnd, charEnd));

        // remove entirely any blocks in the middle
        this.data.blocks.splice(blockStart + 1, (blockEnd - blockStart - 1) );

        // merge startBlock and endBlock
        this.data.blocks = mergeBlocks(this.data.blocks, blockStart, blockStart + 1);

        this.cursor.endPath.pop();
        this.cursor.endPath.pop();
        this.cursor.endPath.push(blockStart);
        this.cursor.endPath.push(charStart);

        this.render();
        this.restoreCursor();
        return true;

    } else if (charStart !== charEnd){

        this.data.blocks[blockStart] = clean(removeText(this.data.blocks[blockStart], charEnd, charEnd - charStart));

        this.cursor.endPath.pop();
        this.cursor.endPath.push(charStart);

        this.render();
        this.restoreCursor();
        return true;
    }
    return false;
}

function handleDelete(keyCode){
    var handled = interceptCrossBlockChanges.call(this);
    if (handled){
        return;
    }

    var cursor = this.getCursor();
    if (!cursor) {
        return;
    } else {
        this.cursor = cursor;
    }

    // TODO
    // backspace across an entire paragraph to where its empty
    // the styling will now be messed up, possibly same as middle of paragraph

    var charStart = cursor.startPath.slice().pop();
    var charEnd = cursor.endPath.slice().pop();
    var blockStart = cursor.startPath.slice(0, -1).pop();
    // var blockEnd = cursor.endPath.slice(0, -1).pop();
    var blockLength = this.data.blocks[blockStart].rawText.length;

    /* first char of paragraph */
    if (keyCode === 8 && charStart === 0){

        blockLength = this.data.blocks[blockStart - 1].rawText.length;

        this.data.blocks = mergeBlocks(this.data.blocks, blockStart - 1, blockStart);

        this.cursor.startPath.pop();
        this.cursor.startPath.pop();
        this.cursor.startPath.push(blockStart - 1);
        this.cursor.startPath.push(blockLength);

        this.cursor.endPath.pop();
        this.cursor.endPath.pop();
        this.cursor.endPath.push(blockStart - 1);
        this.cursor.endPath.push(blockLength);

    /* last char of paragraph */
    } else if (keyCode === 46 && charEnd === blockLength){
        this.data.blocks = mergeBlocks(this.data.blocks, blockStart, blockStart + 1);

        this.cursor.startPath.pop();
        this.cursor.startPath.pop();
        this.cursor.startPath.push(blockStart);
        this.cursor.startPath.push(blockLength);

        this.cursor.endPath.pop();
        this.cursor.endPath.pop();
        this.cursor.endPath.push(blockStart);
        this.cursor.endPath.push(blockLength);

    /* regular delete */
    } else if (keyCode === 8){

        this.data.blocks[blockStart] = clean(removeText(this.data.blocks[blockStart], charEnd, 1));

        this.cursor.startPath.pop();
        this.cursor.startPath.push(charStart - 1);

        this.cursor.endPath.pop();
        this.cursor.endPath.push(charStart - 1);

    /* regular backspace */
    } else if (keyCode === 46){

        this.data.blocks[blockStart] = clean(removeText(this.data.blocks[blockStart], charEnd + 1, 1));

        this.cursor.endPath.pop();
        this.cursor.endPath.push(charStart);
    }

    this.render();
    this.restoreCursor();
}

function handleEnter(){
    var cursor = this.getCursor();
    if (!cursor) {
        return;
    } else {
        this.cursor = cursor;
    }

    var charStart = cursor.startPath.slice().pop();
    var blockStart = cursor.startPath.slice(0, -1).pop();

    // splitBlock
    this.data.blocks = splitBlock(this.data.blocks, blockStart, charStart);

    this.cursor.startPath.pop();
    this.cursor.startPath.pop();
    this.cursor.startPath.push(blockStart + 1);
    this.cursor.startPath.push(0);

    this.cursor.endPath.pop();
    this.cursor.endPath.pop();
    this.cursor.endPath.push(blockStart + 1);
    this.cursor.endPath.push(0);

    this.render();
    this.restoreCursor();
}

function handleShiftEnter(){
    var cursor = this.getCursor();
    if (!cursor) {
        return;
    } else {
        this.cursor = cursor;
    }

    var charStart = cursor.startPath.slice().pop();
    var blockStart = cursor.startPath.slice(0, -1).pop();

    this.data.blocks[blockStart] = clean(insertText(this.data.blocks[blockStart], charStart, '\n'));

    this.cursor.startPath.pop();
    this.cursor.endPath.pop();
    this.cursor.startPath.push(charStart + 1);
    this.cursor.endPath.push(charStart + 1);

    this.render();
    this.restoreCursor();
}

export {
    elKeydownHandler
};