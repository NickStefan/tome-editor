import {clean} from '../model/clean';
import {insertText} from '../model/insert-text';
import {removeText} from '../model/remove-text';

function inputInputHandler(self){
    return function(e){
        var input = this;
        // var blockStart = self.cursor.blockStart;
        var blockStart = self.cursor.startPath.slice(0, -1).pop();
        var cursorStart = self.cursor.startPath.slice().pop();
        var cursorEnd = self.cursor.endPath.slice().pop();

        var collapsed = cursorStart === cursorEnd;

        if (self.composition !== undefined){
            var chars = input.value.slice(self.composition.index, input.selectionEnd);

            if (self.composition.state === 'start'){
                self.data.blocks[blockStart] = clean(insertText(self.data.blocks[blockStart], self.composition.index, chars));
                self.el.innerHTML = self.serialize();

                self.composition.state = 'composing';

            } else if (self.composition.state === 'composing'){

                self.data.blocks[blockStart] = clean(removeText(self.data.blocks[blockStart], self.composition.index + 1, chars.length));
                self.data.blocks[blockStart] = clean(insertText(self.data.blocks[blockStart], self.composition.index, chars));

                self.el.innerHTML = self.serialize();

            } else if (self.composition.state === 'end'){

                self.data.blocks[blockStart] = clean(removeText(self.data.blocks[blockStart], self.composition.index + 1, chars.length));
                self.data.blocks[blockStart] = clean(insertText(self.data.blocks[blockStart], self.composition.index, chars));

                self.cursor.startPath.pop();
                self.cursor.startPath.push(input.selectionStart);
                // self.cursor.start = input.selectionStart;
                self.cursor.endPath.pop();
                self.cursor.endPath.push(input.selectionEnd);
                // self.cursor.end = input.selectionEnd;

                self.el.innerHTML = self.serialize();
                self.restoreCursor();

                self.composition = undefined;
            }
            return;
        }

        // TODO HANDLE mergBlocks when deleting from 0 char of block??

        // collapsed
        if (input.selectionStart === input.selectionEnd){

            // deletion
            if (collapsed && input.selectionEnd < cursorEnd){
                var length = cursorEnd - input.selectionEnd;

                self.data.blocks[blockStart] = clean(removeText(self.data.blocks[blockStart], cursorEnd, length));

                self.cursor.startPath.pop();
                self.cursor.startPath.push(input.selectionStart);

                self.cursor.endPath.pop();
                self.cursor.endPath.push(input.selectionEnd);

                // self.cursor.start = input.selectionStart;
                // self.cursor.end = input.selectionEnd;

            // overwrite
            } else if (!collapsed){
                var overwrite = cursorEnd - cursorStart;
                var chars = input.value.slice(cursorStart, input.selectionStart);
                self.data.blocks[blockStart] = clean(removeText(self.data.blocks[blockStart], cursorEnd, overwrite));
                self.data.blocks[blockStart] = clean(insertText(self.data.blocks[blockStart], cursorStart, chars));

                self.cursor.startPath.pop();
                self.cursor.startPath.push(input.selectionStart);

                self.cursor.endPath.pop();
                self.cursor.endPath.push(input.selectionStart);

                // self.cursor.start = input.selectionStart;
                // self.cursor.end = cursorStart;

            // insertion
            } else if (collapsed && input.selectionStart > cursorStart){
                var chars = input.value.slice(cursorStart, input.selectionStart);

                self.data.blocks[blockStart] = clean(insertText(self.data.blocks[blockStart], cursorStart, chars));

                self.cursor.startPath.pop();
                self.cursor.startPath.push(input.selectionStart);

                self.cursor.endPath.pop();
                self.cursor.endPath.push(input.selectionStart);

                // self.cursor.start = input.selectionStart;
                // self.cursor.end = cursorStart;

            // backspace
            } else if (collapsed && input.selectionStart === cursorStart && input.value.length !== self.data.blocks[blockStart].rawText.length){

                self.data.blocks[blockStart] = clean(removeText(self.data.blocks[blockStart], cursorEnd + 1, 1));

                self.cursor.startPath.pop();
                self.cursor.startPath.push(input.selectionStart);

                self.cursor.endPath.pop();
                self.cursor.endPath.push(input.selectionEnd);

                // self.cursor.start = input.selectionStart;
                // self.cursor.end = input.selectionEnd;
            }


        // DOES THIS EVER GET TRIGGERED???
        // range
        } else {
            var chars = input.value.slice(input.selectionStart, input.selectionEnd);
            console.log('range', chars);

            self.cursor.start = input.selectionStart;
            self.cursor.end = input.selectionEnd;
        }


        self.el.innerHTML = self.serialize();

        self.restoreCursor();
    };
}

function inputKeydownHandler(self){
    return function(e){
        // prevent starting any new compositions when in the input
        if (e.altKey){
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };
}

// http://blog.evanyou.me/2014/01/03/composition-event/
function inputCompositionstartHandler(self){
    return function(e){
        var input = this;
        self.composition = {
            state: 'start',
            index: input.selectionStart
        };
    };
}

function inputCompositionendHandler(self){
    return function(e){
        self.composition = {
            state: 'end',
            index: self.composition.index
        };
    };
}

export {
    inputInputHandler,
    inputKeydownHandler,
    inputCompositionstartHandler,
    inputCompositionendHandler
};