import {Priority} from '../utils/priority';

function mergeDuplicateRanges(ranges){
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
	var current;
	var next;

	while (ranges.peek()){
		next = ranges.pop();

		if (current /* overlaps with next */){
			// join current and next
		}
		cleanedRanges.push(current);
	}

    // iterate
        // check for overlap on next,
        // if overlap, join the next and set yourself as null
    // filter out null

	return cleanedRanges;
}

export default mergeDuplicateRanges;
export {mergeDuplicateRanges};
