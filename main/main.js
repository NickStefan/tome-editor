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

        this.el.setAttribute('contentEditable', true);

        this.el
        .addEventListener('keypress', function(e){
            e.preventDefault();
            e.stopPropagation();

            var cursor = self.getCursor();
            if (!cursor) {
                return;
            }

            var blockStart = cursor.blockStart;
            var start = cursor.start;
            // var end = cursor.end;

            var charsToInsert = ' bob';

            console.dir(e);
            // debugger;

            self.data.blocks[blockStart] = self.clean(insertText(self.data.blocks[blockStart], start, charsToInsert));

            self.el.innerHTML = self.serialize();

            cursor.start += charsToInsert.length;

            self.restoreCursor(cursor);
        });

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
