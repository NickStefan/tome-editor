import {serializeBlock} from '../serialize/serialize-block';

import {insertText} from '../model/insert-text';
import {removeText} from '../model/remove-text';
import {cleanRanges} from '../model/clean-ranges';

import {getCursor} from '../cursor/get-cursor';
import {restoreCursor} from '../cursor/restore-cursor';

function Main(config){
    var self = this;
    this.el = config.el;
    this.data = config.data;

    if (this.el){

        this.hiddenInput = document.createElement('input');
        this.hiddenInput.style.width = this.el.offsetWidth;
        document.body.appendChild(this.hiddenInput);

        this.el
        .setAttribute('contentEditable', true);

        this.el
        .style.whiteSpace = 'pre';

        this.el
        .innerHTML = this.serialize();

        this.el
        .addEventListener('change', function(e){
            if (self.el.offsetWidth !== self.hiddenInput.offsetWidth){
                self.hiddenInput.style.width = self.el.offsetWidth;
            }
        });

        // listeners should be in separate files
        // then called with this context here

        this.el
        .addEventListener('keydown', function(e){
            // http://www.quirksmode.org/js/keys.html
            // console.log('keydown');
            // console.dir(e);

            switch (e.keyCode) {
                case 37:
                    // left
                case 39:
                    // right
                    break;

                // in the future, this will trigger a check for which block you're in
                case 38:
                    // up
                case 40:
                    // down
                    break;

                // will split block later
                case 13:
                    // enter
                    break;
                case 27:
                    // escape
                    break;
                case 16:
                    // shift
                    break;
                // case 9:
                    // tab
                    // break;
                // case ??:
                    // command ?
                // case ??:
                    // fn ?
                // fn keys?

                // FOCUS THE INPUT BOX
                case 46:
                    // backspace
                case 8:
                    // delete
                case 18:
                    // alt / option
                default:
                    self.focusInput();
            }
            return true;
        });

        // TODO:
        // DON'T ADVANCE CURSOR ON 'OPTION' / composition
        // SEE RANGE CODE IN INPUT HANDLER BELOW

        this.hiddenInput
        .addEventListener('input', function(e){
            var input = this;

            // need to cover more cases:
            // el has range, hit delete
            // input will be collapsed, but deleted a range
            //
            // el is collapsed, hit delete
            // input will be collapsed, but deleted collapsed
            //
            // el is collapsed, hit paste
            // input will be range, but el was collapsed?

            var blockStart = self.cursor.blockStart;

            // collapsed
            if (input.selectionStart === input.selectionEnd){

                // deletion
                if (input.selectionEnd < self.cursor.end){
                    var length = self.cursor.end - input.selectionEnd;

                    self.data.blocks[blockStart] = self.clean(removeText(self.data.blocks[blockStart], self.cursor.end, length));

                    self.cursor.start = input.selectionStart;
                    self.cursor.end = input.selectionEnd;

                // insertion
                } else if (input.selectionStart > self.cursor.start){
                    var chars = input.value.slice(self.cursor.start, input.selectionStart);
                    console.log('collapsed', chars);

                    self.data.blocks[blockStart] = self.clean(insertText(self.data.blocks[blockStart], self.cursor.start, chars));

                    self.cursor.start += chars.length;
                    self.cursor.end = self.cursor.start;
                }

            // range
            } else {
                var chars = input.value.slice(input.selectionStart, input.selectionEnd);
                console.log('range', chars);

                self.cursor.start = input.selectionStart;
                self.cursor.end = input.selectionEnd;

                // need to removeText for this range,
                // then insert text for this command
            }


            self.el.innerHTML = self.serialize();

            self.restoreCursor();
        });
    }
}

Main.prototype.serialize = function(){
    return serializeBlock(this.data.blocks[0]);
};

// should be private API
Main.prototype.clean = function(updatedBlock){
    for (var key in updatedBlock.ranges){
        updatedBlock.ranges[key] = cleanRanges(updatedBlock.ranges[key]);
    }
    return updatedBlock;
};

// should be private API
Main.prototype.focusInput = function(){
    var cursor = this.getCursor();
    if (!cursor) {
        return;
    } else {
        this.cursor = cursor;
    }

    var blockStart = cursor.blockStart;
    var start = cursor.start;
    var end = cursor.end;

    this.hiddenInput.focus();
    this.hiddenInput.value = this.data.blocks[blockStart].rawText;
    this.hiddenInput.setSelectionRange(start, end);
};

Main.prototype.getCursor = function(){
    return getCursor.call(this);
};

Main.prototype.restoreCursor = function(cursor){
    restoreCursor.call(this, cursor);
};

if (window){
    window.Tome = Main;
}

export default Main;
export {Main};
