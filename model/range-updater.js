// INLINE OPERATIONS

// q: what happens when I want to add text in the middle of the block
// a: selection 28
//    page5 = insertText(page4, 28, 'also ');

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

 //////////////
// LATER   ///
/////////////

// computedRanges(start, end)

// BLOCK COMMANDS
// splitBlock(index)
// mergeBlock(index1, index2)
// changeBlockType(type)
