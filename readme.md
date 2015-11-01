
# contentEditable sucks
contentEditable uses a tree data model. Tree's are great, except that our user's don't write their text with a tree editor. They instead write their documents as flat ranges. 

We need to have a source of truth that more closely matches how a user thinks of their rich text. They don't think of their rich text as being a tree of JSON or XML/HTML. All the user cares about is 'from here to here should be this or that style'. 

This is why we should use a 'range based' data model, and then serialize it into a tree only for rendering purposes.

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

Serialized:
~~~js
<p>My name <span style="font-style: italic;">is </span><span style="color: green;"><span style="font-style: italic;"><span style="font-weight: 700;">bob</span>.</span> My name is </span><span style="font-weight: 700;"><span style="color: green;">Bob</span> Smith</span></p>';
~~~

# Run Tests
There are currently 18 tests covering 7 different functions
`node wocha -f wocha.webpack.js -w`

# Build
`webpack`

# Project Folder Structure:

## JSON source of truth
### model
(e.g. a single block / inline operations)
 - computedRanges(start, end)

### page
Need a page folder
(handles multi block and cross block operations)
 - splitBlock(page, blockNum, innerIndex);
 - mergeBlock(page, blockNum1, blockNum2);
 - changeBlockType(page, blockNum, type)

## Render and Present
### serialize
 - serialize block
 - serialize page

## Cut / Paste
#### parse
 - parse foreign clipboard data ??? 