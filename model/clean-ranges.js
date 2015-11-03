import {Priority} from '../utils/priority';

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
        initialNodes: ranges
    });

    var cleanedRanges = [];
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

export default cleanRanges;
export {cleanRanges};
