import {serializeBlock} from '../serialize/serialize-block';

import {insertText} from '../model/insert-text';
// import {removeText} from '../model/remove-text';
import {cleanRanges} from '../model/clean-ranges';

import {getCursor} from '../cursor/get-cursor';
import {restoreCursor} from '../cursor/restore-cursor';

function Main(config){
    var self = this;
    this.el = config.el;
    this.data = config.data;

    if (this.el){

        this.el
        .setAttribute('contentEditable', true);

        this.hiddenInput = document.createElement('input');
        this.hiddenInput.style.width = this.el.offsetWidth;
        document.body.appendChild(this.hiddenInput);

        this.el
        .addEventListener('change', function(e){
            if (self.el.offsetWidth !== self.hiddenInput.offsetWidth){
                self.hiddenInput.style.width = self.el.offsetWidth;
            }
        });

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

        this.hiddenInput
        .addEventListener('input', function(e){
            var input = this;

            var blockStart = self.cursor.blockStart;
            var start = self.cursor.start;
            // var end = self.cursor.end;

            // collapsed
            if (input.selectionStart === input.selectionEnd){
                // deletion
                if (input.selectionStart < start){

                } else if (input.selectionStart > start){
                    var chars = input.value.slice(start, input.selectionStart);
                    console.log('collapsed', chars);
                }
            // range
            } else {
                var chars = input.value.slice(input.selectionStart, input.selectionEnd);
                console.log('range', chars);
            }

            self.data.blocks[blockStart] = self.clean(insertText(self.data.blocks[blockStart], start, chars));

            self.el.innerHTML = self.serialize();

            self.cursor.start += chars.length;

            self.restoreCursor(self.cursor);

            return true;
        });

        // this.el
        // .addEventListener('keypress', function(e){
        //     debugger;
        //     e.preventDefault();
        //     e.stopPropagation();

        //     var cursor = self.getCursor();
        //     if (!cursor) {
        //         return;
        //     }

        //     var blockStart = cursor.blockStart;
        //     var start = cursor.start;
        //     // var end = cursor.end;


        //     // do ops,
        //     // reset focus, reset range

        //     var charsToInsert = ' bob';
        //     console.log('keypress');
        //     console.dir(e);

        //     self.data.blocks[blockStart] = self.clean(insertText(self.data.blocks[blockStart], start, charsToInsert));

        //     self.el.innerHTML = self.serialize();

        //     cursor.start += charsToInsert.length;

        //     self.restoreCursor(cursor);
        // });

        this.el.innerHTML = this.serialize();
    }
}

Main.prototype.clean = function(updatedBlock){
    for (var key in updatedBlock.ranges){
        updatedBlock.ranges[key] = cleanRanges(updatedBlock.ranges[key]);
    }
    return updatedBlock;
};

Main.prototype.serialize = function(){
    return serializeBlock(this.data.blocks[0]);
};

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
    return getCursor();
};

Main.prototype.restoreCursor = function(cursor){
    restoreCursor(cursor);
};

if (window){
    window.Tome = Main;
}

export default Main;
export {Main};
