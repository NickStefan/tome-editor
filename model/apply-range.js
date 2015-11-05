
function applyRange(ranges=[], newRange){

    // need to iterate the entire ranges array
    // shrink ALL conflicting ranges (same type, different value)
    // then insert the newRange at the very end

    var deconflictedRanges = [];
    var current;

    for (var i = 0; i < ranges.length; i++){
        current = ranges[i];

        // let cleanRanges deal with deduping same value ranges
        if (current.value === newRange.value){
            deconflictedRanges.push(current);
            continue;
        }

        // different value, need to check

        // overlapping
        // current wholey contains new
        // c --------------
        //      n -----
        if (current.start <= newRange.start && current.end >= newRange.end){
            // need to split current into two ranges
            // c --- n ---- c ----
            // current1 current start with new's start as end
            // current2 new end current end
            deconflictedRanges.push({
                name: current.name,
                value: current.value,
                start:  current.start,
                end: newRange.start

            });

            deconflictedRanges.push({
                name: current.name,
                value: current.value,
                start: newRange.end,
                end: current.end
            });
        }

        // overlapping
        // current contained wholey inside new
        // n --------------
        //      c ----
        else if (newRange.start <= current.start && newRange.end >= current.end){
            continue;
        }

        // overlapping
        // current left of new
        // c ----------
        //         n -------
        else if (current.start < newRange.start && current.end >= newRange.start){

            // need to subtract from current's end property
            // c --- n ------
            current.end = newRange.start;
            deconflictedRanges.push(current);
        }

        // overlapping
        // current right of new
        // n --------
        //       c -------
        else if (newRange.start < current.start && newRange.end >= current.start){

            // need to add to current's start property
            // n ------- c---
            current.start = newRange.end;
            deconflictedRanges.push(current);

        } else {
            deconflictedRanges.push(current);
        }
    }

    deconflictedRanges.push(newRange);

    return deconflictedRanges;
}

export default applyRange;
export { applyRange };