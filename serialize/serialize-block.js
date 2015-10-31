import {Priority} from './priority';

// serializes block model to to string representation of HTML
function serializeBlock (block){

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
        initialNodes: block.styles
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

        if (toBeOpened.peek() && i === toBeOpened.peek().start ){
            text = openTags(text, i, toBeOpened, toBeClosed);
        }

        text += char;

        if (toBeClosed.peek() && i === toBeClosed.peek().end ){
            text = closeTags(text, i, toBeOpened, toBeClosed);
        }
    }
    return text + '</' + block.blockType.toLowerCase() + '>';
}

// newTag = toBeOpened.pop()
// lastOpen = toBeClosed.peek()
// if newTag.end > lastOpen.end,
// you need to close lastOpen, and re-open lastOpen after newTag

function openTags(text, i, toBeOpened, toBeClosed){
    if (toBeOpened.peek() && i === toBeOpened.peek().start){
        var style = toBeOpened.pop();
        if (toBeClosed.peek() && style.end > toBeClosed.peek().end){
            text = closeSpan(text, toBeClosed.peek());
            text = openSpan(text, style);
            text = openSpan(text, toBeClosed.peek());
        } else {
            text = openSpan(text, style);
        }
        toBeClosed.add(style);
        text = openTags(text, i, toBeOpened, toBeClosed);
    }
    return text;
}

function closeTags(text, i, toBeOpened, toBeClosed){
    if (toBeClosed.peek() && i === toBeClosed.peek().end){
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

export default serializeBlock;
export { serializeBlock };
