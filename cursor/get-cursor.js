

function getCursor(){
    if (!window.getSelection().rangeCount){
        return;
    }

    var nativeRange = window.getSelection().getRangeAt(0);

    // recurse upward until parent is contentEditable
    // get index of which block you are
    var startBlock = getTargetParentChild(nativeRange.startContainer, '[data-tome]');
    var blockStart = indexOf( startBlock.parentElement.childNodes, startBlock );

    // recurse upward until parent is contentEditable
    // get index of which block you are
    var endBlock = getTargetParentChild(nativeRange.endContainer, '[data-tome]');
    var blockEnd = indexOf( endBlock.parentElement.childNodes, endBlock );

    // walk left to beginning of block, count chars
    var start = countFromLeft(startBlock, nativeRange.startContainer, nativeRange.startOffset);

    // walk right to end of block, count chars
    var end = countFromLeft(endBlock, nativeRange.endContainer, nativeRange.endOffset);

    return {
        blockStart: blockStart,
        blockEnd: blockEnd,
        start: start,
        end: end,
        nativeRange: nativeRange
    };
}


function countFromLeft(block, target, targetOffset){
    // if target not a text node, recurse down???

    var textNodes = collectTextNodes(block, []);
    var count = 0;
    for (var i=0; i<textNodes.length; i++){
        if (textNodes[i] === target){
            count += targetOffset;
            break;
        }
        count += textNodes[i].textContent.length;
    }
    return count;
}

// function countFromRight(block, target, targetOffset){
//     // if target not a text node, recurse down???

//     var textNodes = collectTextNodes(block, []);
//     var count = 0;
//     for (var i= textNodes.length - 1; i >= 0; i--){
//         if (textNodes[i] === target){
//             count += targetOffset;
//             break;
//         }
//         count += textNodes[i].textContent.length;
//     }
//     return count;
// }



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

function getTargetParentChild(el, selector){
    if (matchesSelector(el.parentElement, selector)){
        return el;
    } else {
        return getTargetParentChild(el.parentElement, selector);
    }
}

function matchesSelector(element, selector){
    var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
    var i = 0;

    while (matches[i] && matches[i] !== element) {
        i++;
    }

    return matches[i] ? true : false;
}

function indexOf(arr, node){
    return Array.prototype.indexOf.call(arr, node);
}

export default getCursor;
export {getCursor};