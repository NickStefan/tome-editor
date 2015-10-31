import {Priority} from '../priority';

describe('Priority Data Structure', function() {

    it('should correctly min sort the nodes by named property', function () {

        var nodes = [
            { start : 3 },
            { start : 1 },
            { start : 0 },
            { start : 4 },
            { start : 2 }
        ];

        var priority = new Priority({
            prioritize: [
                {
                    name: 'start',
                    priority: 'min'
                }
            ],
            initialNodes: nodes
        });

        expect(priority.peek().start).to.equal(0);
        priority.pop();
        expect(priority.peek().start).to.equal(1);
        priority.pop();
        expect(priority.peek().start).to.equal(2);
        priority.pop();
        expect(priority.peek().start).to.equal(3);
        priority.pop();
        expect(priority.peek().start).to.equal(4);
    });

    it('should correctly max sort the nodes by named property', function () {

        var nodes = [
            { start : 3 },
            { start : 1 },
            { start : 0 },
            { start : 4 },
            { start : 2 }
        ];

        var priority = new Priority({
            prioritize: [
                {
                    name: 'start',
                    priority: 'max'
                }
            ],
            initialNodes: nodes
        });

        expect(priority.peek().start).to.equal(4);
        priority.pop();
        expect(priority.peek().start).to.equal(3);
        priority.pop();
        expect(priority.peek().start).to.equal(2);
        priority.pop();
        expect(priority.peek().start).to.equal(1);
        priority.pop();
        expect(priority.peek().start).to.equal(0);
    });

    it('should correctly sort by second priority when first is a tie', function () {

        var nodes = [
            { start : 3, end: 4 },
            { start : 0, end: 4 },
            { start : 0, end: 9 },
            { start : 2, end: 12},
            { start : 2, end: 10}
        ];

        var priority = new Priority({
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
            initialNodes: nodes
        });

        expect(priority.peek().start).to.equal(0);
        expect(priority.peek().end).to.equal(9);
        priority.pop();
        expect(priority.peek().start).to.equal(0);
        expect(priority.peek().end).to.equal(4);
        priority.pop();
        expect(priority.peek().start).to.equal(2);
        expect(priority.peek().end).to.equal(12);
        priority.pop();
        expect(priority.peek().start).to.equal(2);
        expect(priority.peek().end).to.equal(10);
        priority.pop();
        expect(priority.peek().start).to.equal(3);
    })
});