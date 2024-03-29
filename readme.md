# Tome Editor

A rich text editor written in javascript. Content editable is treated as mere IO to the actual json data model.

- ContentEditable is the render output (for the text and cursor)
- A hidden Input is the user input
- Javascript application code makes up the actual text editing engine that acts against an internal JSON structure

## contentEditable sucks
contentEditable uses a tree data model. Tree's are great, except that our user's don't write their text with a tree editor. They instead write their documents as flat ranges. 

We need to have a source of truth that more closely matches how a user thinks of their rich text. They don't think of their rich text as being a tree of JSON or XML/HTML. All the user cares about is 'from here to here should be this or that style'. 

This is why we should use a 'range based' data model, and then serialize it into a tree only for rendering purposes.

Separating the rendering, data, and application logic means we can have a tested and well behaved application model. In contentEditable, the rendering, data, and application logic are so interwined that its impossible to isolate bugs to just one of those concerns.

Example model:
~~~js
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            ranges: {
                fontWeight: [
                    { name: 'fontWeight', value: '700', start: 11, end: 13 },
                    { name: 'fontWeight', value: '700', start: 27, end: 35 },
                ],
                color: [
                    { name: 'color', value: 'green', start: 11, end: 29 },
                ],
                fontStyle: [
                    { name: 'fontStyle', value: 'italic', start: 8, end: 14 }
                ]
            }
        };
~~~

If different type CSS ranges overlap, that's a rendering concern, rather than a data concern. We shouldn't force our data model to branch a single range just because there's another type of range that forces it. Imagine if you had to use the serialization below as your _data_ model! That's what contentEditable does. The range based model is much better.

Rendered:
~~~js
<p>My name <span style="font-style: italic;">is </span><span style="color: green;"><span style="font-style: italic;"><span style="font-weight: 700;">bob</span>.</span> My name is </span><span style="font-weight: 700;"><span style="color: green;">Bob</span> Smith</span></p>';
~~~

## Install
`$ npm install`

## Tests
There are currently 26 tests. Its mocha + webpack.
`$ npm test`

## Build
`$ npm run build`

## Example App
```
$ npm run build
$ npm run example // go to localhost:8000
```

This text editor is intended for use with custom UI. The example app merely creates buttons wrapping the __applyRange()__ API.

## API:

__Tome()__ constructor:
```
var Tome = new Tome({
    el: el,
    debugEl: debugEl,
    testUiEl: uiEl,
    data: {
        blocks: [
            {
                blockType: 'P',
                rawText: 'bob writes some text.',
                ranges: {
                    fontWeight: [
                        { name: 'fontWeight', value: '700', start: 11, end: 15}
                    ]
                }
            }
        ]
    }
});
```

`el` is the contentEditable dom node you want Tome to control. Tome will automatically render your data model if passed an `el` argument.
`debugEl` is a dom node that Tome may inject a prettified JSON representing the internal data model (extremely helpful).
`testUiEl` when given a dom node, Tome will inject the testUi into this node when __createTestUI()__ api is used

__createTestUI()__
Takes JSON to quickly generate UI for testing:
```
var UI = [
    {
        label: 'bold',
        el: 'button',
        event: 'click',
        handler: function(self){
            return function(e){
                self.applyRange({name: 'fontWeight', value: 700 });
            }
        }
    }
]
tomeInstance.createTestUi(UI);
```

__getCursor()__

returns
```
{
    startPath: [<blockIndex>,<charIndex>]
    endPath: [<blockIndex>,<charIndex>]
}
```
block index is the index of the block in the text area. the char index is the character index starting from the beginning of the block. this api supports nesting blocks within blocks as well by prepending an additional block index to the beginning of the array like `<blockIndex>, <listIndex>, <charIndex>` etc.

__setCursor()__
takes same API as what *getCursor* returns.

__render()__
recreates the textarea from the source of truth internal data structure (no more content editable ruining your data). This turns the more flat JSON into a more tree structured HTML. This is probably the most critical part of the application.

If no 'el' property was passed at Tome's initialization, this method will return a string of the rendered HTML, rather than update the controlled dom node.

__applyRange()__
`self.applyRange({name: 'fontStyle', value: 'italic'});` applies the style to the currently selected range

see the model directory for more of the interal APIs such as:
__insertText()__, __clean()__, __mergeBlocks()__, __removeText()__, __splitBlock()__

__updateRanges()__ 
Is the most critical internal method. Storing all of the styling as index based ranges, means that we have to correctly update these ranges on every insertion, deletion and block split.
