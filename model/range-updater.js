// INLINE OPERATIONS

// example:
var page1 = {
    blocks: [
        {
            blockType: 'P',
            rawText: 'My name is bob.',
            styles: [
                { name: 'fontWeight', value: '700', start: 11, end: 13}
            ]
        },
        {
            blockType: 'P',
            rawText: 'His name is tim.',
            styles: [
                { name: 'fontWeight', value: 'bold', start: 12, end: 14 }
            ]
        }
    ]
}
// var html = <p>My name is <span style="font-weight: bold">bob</span>.</p>



// q: what happens when we insert text at the end of p1?
// a: selection = 14,
//    insert text
//    findWhere selection interstects any style range
//    for each found
//         update ranges by selection length
//    add text

var page2 = {
    blocks: [
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            styles: [
                { name: 'fontWeight', start: 11, end: 13}
            ]
        },
        {
            blockType: 'P',
            rawText: 'His name is tim.',
            styles: [
                { name: 'fontWeight', value: 'bold', start: 12, end: 14 }
            ]
        }
    ]
}

// var html = <p>My name is <span style="font-weight: bold">bob</span>. My name is Bob Smith</p>





// q: what happens when we want to bold Bob Smith?
// a: selection start 28 end 38
//    apply style fontWeight
//    findWhere selection intersects style range
//    for each found
//       update range
//    if none found
//       make new range

var page3 = {
    blocks: [
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            styles: [
                { name: 'fontWeight', value: '700', start: 11, end: 13},
                { name: 'fontWeight', value: '700', start: 27, end: 35}
            ]
        },
        {
            blockType: 'P',
            rawText: 'His name is tim.',
            styles: [
                { name: 'fontWeight', value: 'bold', start: 12, end: 14 }
            ]
        }
    ]
}

// var html = <p>My name is <span style="font-weight: bold">bob</span>. My name is <span style="font-weight: bold">Bob Smith</span></p>




// q: what happens when we want to color bob to Bob green?
// a: selection start 11 end 31
//    apply style color
//    findWhere selection intersects style range
//    for each found
//       update range
//    if none found
//       make new range

var page4 = {
    blocks: [
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            styles: [
                { name: 'fontWeight', value: '700', start: 11, end: 13 },
                { name: 'fontWeight', value: '700', start: 27, end: 35 },
                { name: 'color', value: 'green', start: 11, end: 29 }
            ]
        },
        {
            blockType: 'P',
            rawText: 'His name is tim.',
            styles: [
                { name: 'fontWeight', value: 'bold', start: 12, end: 14 }
            ]
        }
    ]
}
// var html = <p>My name is <span style="color:green"><span style="font-weight: bold">bob</span>. My name is </span><span style="font-weight: bold"><span style="color: green">Bob</span> Smith</span></p>



// q: what happens when I want to add text in the middle of the block
// a: selection 28
//    insert text 5 characters
//    findWhere selection intersects any font-style range
//    for each found font-style range
//       update range
//    if none found
//       make new range

var page5 = {
    blocks: [
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is also Bob Smith',
            styles: [
                { name: 'fontWeight', value: '700', start: 11, end: 13 },
                { name: 'fontWeight', value: '700', start: 32, end: 40 },
                { name: 'color', value: 'green', start: 11, end: 34 }
            ]
        },
        {
            blockType: 'P',
            rawText: 'His name is tim.',
            styles: [
                { name: 'fontWeight', value: 'bold', start: 12, end: 14 }
            ]
        }
    ]
};
// var html = <p>My name is <span style="color:green"><span style="font-weight: bold">bob</span>. My name is also <span style="font-weight: bold">Bob</span></span><span style="font-weight: bold"> Smith</span></p>




// q: what happens when I want to italicize from is to bob, and keep the old styles?
// a: selection start 8 end 14
//    apply style font-style
//    findWhere selection intersects any style range
//    for each found
//       update range
//    if none found
//       make new range

var page6 = {
    blocks: [
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            styles: [
                { name: 'fontWeight', value: '700', start: 11, end: 13 },
                { name: 'fontWeight', value: '700', start: 27, end: 35 },
                { name: 'color', value: 'green', start: 11, end: 29 },
                { name: 'fontStyle', value: 'italic', start: 8, end: 14 }
            ]
        },
        {
            blockType: 'P',
            rawText: 'His name is tim.',
            styles: [
                { name: 'fontWeight', value: 'bold', start: 12, end: 14 }
            ]
        }
    ]
}

// var html = <p>My name <span style="font-style: italic;">is </span><span style="color: green;"><span style="font-style: italic;"><span style="font-weight: 700;">bob</span>.</span> My name is </span><span style="font-weight: 700;"><span style="color: green;">Bob</span> Smith</span></p>





// TODO
// updateRanges(ranges, start, length, addOrRemove)

// INLINE COMMANDS
// insertText(index, charsToInsert)
// removeText(start, end)
// computedRanges(start, end)

// BLOCK COMMANDS
// splitBlock(index)
// mergeBlock(index1, index2)
// changeBlockType(type)


// updateRange
var style1 = { name: 'fontWeight', value: '700', start: 11, end: 13 };
// output = { name: 'fontWeight', value: '700', start: 11, end: 14 }
console.log(updateRange(style1, 12, 1, 'add'));

function updateRange(styleObj, start, length, addOrRemove){
    if (addOrRemove === 'add'){
        styleObj.end = styleObj.end + length;
    } else if (addOrRemove === 'remove'){
        styleObj.end = styleObj.end - length;
    }
    return styleObj;
}

