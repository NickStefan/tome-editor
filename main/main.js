import {renderBlocks} from '../render/render-block';
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
    this.debugEl = config.debugEl;
    this.testUiEl = config.testUiEl;
    this.data = config.data;

    if (this.el){

        this.hiddenInput = document.createElement('textarea');
        this.hiddenInput.style.width = this.el.offsetWidth;
        document.body.appendChild(this.hiddenInput);

        this.el
        .setAttribute('contentEditable', true);

        this.el
        .style.whiteSpace = 'pre';

        this.render();


        // EL HANDLERS
        this.el
        .addEventListener('change', function(e){
            if (self.el.offsetWidth !== self.hiddenInput.offsetWidth){
                self.hiddenInput.style.width = self.el.offsetWidth;
            }
        });

        this.el
        .addEventListener('blur', function(e){
            // cache cursor for when clicking on styling UI
            var cursor = self.getCursor();
            if (cursor) {
                self.cursor = cursor;
            }
            return true;
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

        window._testTome = this;
    }
}

Main.prototype.applyRange = function(range){
    this.cursor = this.cursor || this.getCursor();
    if (!this.cursor){
        return;
    }

    var cursor = this.cursor;
    var blockStart = cursor.startPath.slice(0, -1).pop();
    var blockEnd = cursor.endPath.slice(0, -1).pop();
    range.start = range.start || cursor.startPath.slice().pop();
    range.end = range.end || cursor.endPath.slice().pop();

    for (var i=blockStart; i!==(blockEnd+1);i++){
        this.data.blocks[i].ranges[ range.name ] = applyRange(this.data.blocks[i].ranges[ range.name ], {
            start: i === blockStart ? range.start : 0,
            end: i === blockEnd ? range.end : this.data.blocks[i].rawText.length,
            name: range.name,
            value: range.value
        });
        this.data.blocks[i] = clean(this.data.blocks[i]);
    }

    this.render();
    this.restoreCursor();
};

Main.prototype.render = function(){
    if (this.el){
        this.el.innerHTML = renderBlocks(this.data);
    } else {
        return renderBlocks(this.data);
    }

    if (this.debugEl){
        this.debugEl.innerHTML = `<pre>${JSON.stringify(this.data, null, 4)}</pre>`;
    }
};

Main.prototype.getCursor = function(){
    return getCursor.call(this);
};

Main.prototype.restoreCursor = function(cursor){
    restoreCursor.call(this, cursor);
};

Main.prototype.createTestUI = function(UI){
    var self = this;

    if (this.testUiEl){
        var uiContainer = document.createElement('DIV');

        for (var i=0; i < UI.length; i++){
            var data = UI[i];
            switch (data.el){
                case 'button':
                    var el = document.createElement('BUTTON');
                    el.innerHTML = data.label;
                    el.addEventListener(data.event, data.handler(self));
                    break;
            }
            uiContainer.appendChild(el);
        }

        this.testUiEl.innerHTML = '';
        this.testUiEl.appendChild(uiContainer);
    }
};

if (window){
    window.Tome = Main;
}

export default Main;
export {Main};
