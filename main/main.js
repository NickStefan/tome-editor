import {serializeBlock} from '../serialize/serialize-block';

import {insertText} from '../model/insert-text';
import {removeText} from '../model/remove-text';
import {clean} from '../model/clean';

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

            // hot keys
            if (e.metaKey || e.ctrlKey){
                switch (e.keyCode){
                    case 73: // i
                        // self.applyStyle({name: 'fontStyle', value: 'italic'});
                    case 66: // b
                        // self.applyStyle({name: 'fontWeight', value: 700});
                    case 85: // u
                        // self.applyStyle({name: 'textDecoration', value: 'underline'});
                        return false;
                        break;
                }
            }

            switch (e.keyCode) {

                // ARROWS
                case 37: // left
                case 39: // right
                case 38: // up
                case 40: // down
                    break;

                case 13: // enter === will split block later
                    break;

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

                // FOCUS THE INPUT BOX
                case 46: // backspace
                case 8:  // delete --- need to handle when its the first character of a block???
                default:
                    self.focusInput();
            }
            return true;
        });



        // http://blog.evanyou.me/2014/01/03/composition-event/
        this.hiddenInput
        .addEventListener('compositionstart', function(e){
            var input = this;
            self.composition = {
                state: 'start',
                index: input.selectionStart
            };
        });

        this.hiddenInput
        .addEventListener('compositionend', function(e){
            self.composition = {
                state: 'end',
                index: self.composition.index
            };
        });

        this.hiddenInput
        .addEventListener('keydown', function(e){
            // prevent starting any new compositions when in the input
            if (e.altKey){
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        this.hiddenInput
        .addEventListener('input', function(e){
            var input = this;
            var blockStart = self.cursor.blockStart;
            var collapsed = self.cursor.start === self.cursor.end;

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

                    self.cursor.start = input.selectionStart;
                    self.cursor.end = input.selectionEnd;

                    self.el.innerHTML = self.serialize();
                    self.restoreCursor();

                    self.composition = undefined;
                }
                return;
            }

            // collapsed
            if (input.selectionStart === input.selectionEnd){

                // deletion
                if (collapsed && input.selectionEnd < self.cursor.end){
                    var length = self.cursor.end - input.selectionEnd;

                    self.data.blocks[blockStart] = clean(removeText(self.data.blocks[blockStart], self.cursor.end, length));

                    self.cursor.start = input.selectionStart;
                    self.cursor.end = input.selectionEnd;

                // overwrite
                } else if (!collapsed){
                    var overwrite = self.cursor.end - self.cursor.start;
                    var chars = input.value.slice(self.cursor.start, input.selectionStart);
                    self.data.blocks[blockStart] = clean(removeText(self.data.blocks[blockStart], self.cursor.end, overwrite));
                    self.data.blocks[blockStart] = clean(insertText(self.data.blocks[blockStart], self.cursor.start, chars));

                    self.cursor.start = input.selectionStart;
                    self.cursor.end = self.cursor.start;

                // insertion
                } else if (collapsed && input.selectionStart > self.cursor.start){
                    var chars = input.value.slice(self.cursor.start, input.selectionStart);

                    self.data.blocks[blockStart] = clean(insertText(self.data.blocks[blockStart], self.cursor.start, chars));

                    self.cursor.start = input.selectionStart;
                    self.cursor.end = self.cursor.start;
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
        });
    }
}

Main.prototype.serialize = function(){
    return serializeBlock(this.data.blocks[0]);
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
