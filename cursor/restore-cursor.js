function restoreCursor(cursor){
    cursor = cursor || this.cursor;

    var nativeSelection = window.getSelection();

    var startBlock = getBlockFromIndex(this.el, cursor.blockStart);
    var endBlock = getBlockFromIndex(this.el, cursor.blockEnd);

    var starting = getTextNodeFromCount(startBlock, cursor.start);

    var ending = getTextNodeFromCount(endBlock, cursor.end);

    var range = document.createRange();

    range.setStart(starting.node, starting.offset);
    range.setEnd(ending.node, ending.offset);

    nativeSelection.removeAllRanges();
    nativeSelection.addRange(range);
}

function getBlockFromIndex(editableRoot, index){
    return editableRoot.children[index];
}


function getTextNodeFromCount(block, targetCount){
    var offset;
    var node;

    var textNodes = collectTextNodes(block, []);
    var count = 0;
    for (var i=0; i<textNodes.length; i++){
        if (textNodes[i].textContent.length + count >= targetCount){
            node = textNodes[i];
            offset = targetCount - count;
            break;
        }
        count += textNodes[i].textContent.length;
    }
    return {
        node: node,
        offset: offset
    };
}

function collectTextNodes(element, texts) {
    for (var child = element.firstChild; child!==null; child = child.nextSibling) {
        if (child.nodeType===3){
            texts.push(child);
        } else if (child.nodeType===1){
            collectTextNodes(child, texts);
        }
    }
    return texts;
}

export default restoreCursor;
export {restoreCursor};