import {renderBlock} from '../render-block';

describe('Block Renderer', function() {

    it('should render a styled range', function () {

        var blockSingleStyle =
        {
            blockType: 'P',
            rawText: 'My name is bob.',
            ranges: {
                fontWeight: [
                    { name: 'fontWeight', value: '700', start: 11, end: 14}
                ]
            }
        };
        var blockSingleStyleHTML = '<p>My name is <span style="font-weight: 700;">bob</span>.</p>';

        expect(renderBlock(blockSingleStyle)).to.equal(blockSingleStyleHTML);
    });

    it('should render multiple styled ranges', function () {

        var blockMultiStyle =
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            ranges: {
                fontWeight: [
                    { name: 'fontWeight', value: '700', start: 11, end: 14},
                    { name: 'fontWeight', value: '700', start: 27, end: 36}
                ]
            }
        };
        var blockMultiStyleHTML = '<p>My name is <span style="font-weight: 700;">bob</span>. My name is <span style="font-weight: 700;">Bob Smith</span></p>';

        expect(renderBlock(blockMultiStyle)).to.equal(blockMultiStyleHTML);
    });


    it('should render nested styled ranges', function () {

        var blockNestedStyle =
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            ranges: {
                fontWeight: [
                    { name: 'fontWeight', value: '700', start: 11, end: 14 },
                    { name: 'fontWeight', value: '700', start: 27, end: 36 }
                ],
                color: [
                    { name: 'color', value: 'green', start: 11, end: 30 }
                ]
            }
        };
        var blockNestedStyleHTML = '<p>My name is <span style="color: green;"><span style="font-weight: 700;">bob</span>. My name is </span><span style="font-weight: 700;"><span style="color: green;">Bob</span> Smith</span></p>';

        expect(renderBlock(blockNestedStyle)).to.equal(blockNestedStyleHTML);
    });



    it('should render multiple partially overlapping nested style ranges', function () {

        var blockMultiPartialOverlappedStyles =
        {
            blockType: 'P',
            rawText: 'My name is bob. My name is Bob Smith',
            ranges: {
                fontWeight: [
                    { name: 'fontWeight', value: '700', start: 11, end: 14 },
                    { name: 'fontWeight', value: '700', start: 27, end: 36 },
                ],
                color: [
                    { name: 'color', value: 'green', start: 11, end: 30 },
                ],
                fontStyle: [
                    { name: 'fontStyle', value: 'italic', start: 8, end: 15 }
                ]
            }
        };

        var blockMultiPartialOverlappedStylesHTML = '<p>My name <span style="font-style: italic;">is </span><span style="color: green;"><span style="font-style: italic;"><span style="font-weight: 700;">bob</span>.</span> My name is </span><span style="font-weight: 700;"><span style="color: green;">Bob</span> Smith</span></p>';

        expect(renderBlock(blockMultiPartialOverlappedStyles)).to.equal(blockMultiPartialOverlappedStylesHTML);
    });

    it('should render many multiple partially overlapping nested style ranges', function(){

        var state =
        {
            "blockType": "P",
            "rawText": "My name is bob.",
            "ranges": {
                "fontWeight": [
                    {
                        "name": "fontWeight",
                        "value": "700",
                        "start": 11,
                        "end": 14
                    }
                ],
                "fontStyle": [
                    {
                        "name": "fontStyle",
                        "value": "italic",
                        "start": 8,
                        "end": 15
                    }
                ],
                "color": [
                    {
                        "name": "color",
                        "value": "skyblue",
                        "start": 0,
                        "end": 10
                    }
                ],
                "fontFamily": [
                    {
                        "name": "fontFamily",
                        "value": "arial",
                        "start": 0,
                        "end": 12
                    }
                ]
            }
        };

        var goal = '<p><span style="font-family: arial;"><span style="color: skyblue;">My name </span></span><span style="font-style: italic;"><span style="font-family: arial;"><span style="color: skyblue;">is</span> </span></span><span style="font-style: italic;"><span style="font-weight: 700;"><span style="font-family: arial;">b</span>ob</span>.</span></p>';
        expect(renderBlock(state)).to.equal(goal);
    });
});
