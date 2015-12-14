
var el = document.querySelector('[data-tome]');
var debugEl = document.querySelector('[data-tome-debug]');
var uiEl = document.querySelector('[data-tome-test-ui]');

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
            },
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
            },
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
            }
        ]
    }
});