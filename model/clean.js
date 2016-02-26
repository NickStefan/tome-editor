import {Priority} from '../utils/priority';

function clean(updatedBlock){
    for (var key in updatedBlock.ranges){
        updatedBlock.ranges[key] = cleanRanges(updatedBlock.ranges[key]);
    }
    return updatedBlock;
};

function cleanRanges(ranges){
    ranges = new Priority({
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
        initialNodes: ranges.slice()
    });

    var cleanedRanges = [];

    if (!ranges.peek()){
        return cleanedRanges;
    }

    var current = ranges.pop();
    var next;

    if (!ranges.peek()){
        cleanedRanges.push(current);
    }

    while (ranges.peek()){
        next = ranges.pop();

        // overlapping
        // current wholey contains next
        // c --------------
        //      n -----
        if (current.start <= next.start && current.end >= next.end){
            next = null;
            // re-use current
        }

        // overlapping
        // current left of next
        // c ----------
        //         n -------
        else if (current.start < next.start && current.end >= next.start){
            current.end = next.end;
            next = null;
            // re-use current
        }


        if (ranges.peek() && next === null){
            continue;

        } else if (!ranges.peek() && next !== null){
            cleanedRanges.push(current);
            cleanedRanges.push(next);

        } else {
            cleanedRanges.push(current);
            current = next;
        }
    }

    return cleanedRanges;
}

export default clean;
export { clean };
