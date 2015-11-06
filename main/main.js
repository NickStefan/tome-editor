import {serializeBlock} from '../serialize/serialize-block';
import {applyRange} from '../model/apply-range';
import {clean} from '../model/clean';

import {
    inputInputHandler,
    inputKeydownHandler,
    inputCompositionstartHandler,
    inputCompositionendHandler
} from '../handlers/input-handlers';

import {elKeydownHandler} from '../handlers/el-handlers';

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

        this.el
        .addEventListener('keydown', elKeydownHandler(self));

        // INPUT HANDLERS
        this.hiddenInput
        .addEventListener('compositionstart', inputCompositionstartHandler(self));

        this.hiddenInput
        .addEventListener('compositionend', inputCompositionendHandler(self));

        this.hiddenInput
        .addEventListener('keydown', inputKeydownHandler(self));

        this.hiddenInput
        .addEventListener('input', inputInputHandler(self));
    }
}

Main.prototype.applyRange = function(range){
    var cursor = this.getCursor();
    if (!cursor) {
        return;
    } else {
        this.cursor = cursor;
    }
    var blockStart = cursor.blockStart;

    range.start = range.start || cursor.start;
    range.end = range.end || cursor.end;

    this.data.blocks[blockStart].ranges[ range.name ] = applyRange(this.data.blocks[blockStart].ranges[ range.name ], range);
    this.data.blocks[blockStart] = clean(this.data.blocks[blockStart]);

    this.el.innerHTML = this.serialize();
    this.restoreCursor();
};

// will change to a serializePage method ???
Main.prototype.serialize = function(){
    window.data = this.data;
    return serializeBlock(this.data.blocks[0]);
};

// maybe make private ???
Main.prototype.focusInput = function(){

    // maybe this should go into an onblur handler
    // that way we'll always have cursor when clicking onto UI stuff
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
