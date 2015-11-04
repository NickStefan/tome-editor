
var el = document.querySelector('[data-tome]');

var Tome = new Tome({
    el: el,
    data: {
        blocks: [
            {
                blockType: 'P',
                rawText: 'My name is bob.',
                ranges: {
                    fontWeight: [
                        { name: 'fontWeight', value: '700', start: 11, end: 14}
                    ]
                }
            }
        ]
    }
});