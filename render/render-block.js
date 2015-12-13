import {Priority} from '../utils/priority';

function flattenRanges(obj){
    var arr = [];
    for (var key in obj){
        arr.push(obj[key]);
    }
    return Array.prototype.concat.apply([], arr);
}

// serializes block model to to string representation of HTML
function renderBlock (block){

    var text = '<' + block.blockType.toLowerCase() + '>';

    // lowest start index has highest priority
    // if two have same start index, the highest max index has priority
    var toBeOpened = new Priority({
        prioritize: [
            {
                name: 'start',
                priority: 'min'
            },
            {
                name: 'end',
                priority: 'max'
            }
        ],
        initialNodes: flattenRanges(block.ranges)
    });

    // lowest end index value has highest priority
    var toBeClosed = new Priority({
        prioritize: [
            {
                name: 'end',
                priority: 'min'
            }
        ]
    });

    var char;
    for (var i = 0; i < block.rawText.length; i++ ){

        char = block.rawText[i];

        if (toBeOpened.peek() && i === toBeOpened.peek().start){
            while (toBeOpened.peek() && i === toBeOpened.peek().start && toBeOpened.peek().end === toBeOpened.peek().start){
                toBeOpened.pop();
            }
            text = openTags(text, i, toBeOpened, toBeClosed);
        }

        if (char === '\n'){
            // render soft breaks
            text += '<br>';
        } else {
            text += char;
        }

        if (toBeClosed.peek() && i === toBeClosed.peek().end - 1){
            text = closeTags(text, i, toBeOpened, toBeClosed);
        }
    }

    // if no characters, need a BR for something to click the cursor into
    if (!char){
        text += '<br>';
    }

    return text + '</' + block.blockType.toLowerCase() + '>';
}

// newTag = toBeOpened.pop()
// lastOpen = toBeClosed.peek()
// if newTag.end > lastOpen.end,
// you need to close lastOpen, and re-open lastOpen after newTag

function openTags(text, i, toBeOpened, toBeClosed){
    if (toBeOpened.peek() && i === toBeOpened.peek().start){
        var range = toBeOpened.pop();
        if (toBeClosed.peek() && range.end > toBeClosed.peek().end){
            // NEED TO CLOSE ALL toBeCLosed,
            // and REOPEN by closing latest priority (include the new range in this priority)
            for (var j = 0; j < toBeClosed.toArray().length; j++){
                text = closeSpan(text, {});
            }

            var reOpen = new Priority({
                prioritize: [
                    {
                        name: 'end',
                        priority: 'max'
                    }
                ],
                initialNodes: toBeClosed.toArray().concat(range)
            });

            while (reOpen.peek()){
                text = openSpan(text, reOpen.pop());
            }

        } else {
            text = openSpan(text, range);
        }
        toBeClosed.add(range);
        text = openTags(text, i, toBeOpened, toBeClosed);
    }
    return text;
}

function closeTags(text, i, toBeOpened, toBeClosed){
    if (toBeClosed.peek() && i === toBeClosed.peek().end - 1){
        text = closeSpan(text, toBeClosed.pop());
        text = closeTags(text, i, toBeOpened, toBeClosed);
    }
    return text;
}

function openSpan(text, style){
    return text + '<span style="' + toCSSName(style.name) + ': ' + (style.value || '') + (style.unit || '') + ';">';
}

function closeSpan(text, style){
    return text += '</span>';
}

function toCSSName(str){
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}



function renderBlocks(data){
    var text = '';
    for (var block in data.blocks){
        text += renderBlock( data.blocks[block] );
    }
    return text;
}

export default renderBlock;
export { renderBlock, renderBlocks };
