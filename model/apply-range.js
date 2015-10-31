

function applyRange(ranges, newRange){

    var rangeApplied = false;
    var curr;

    for (var i = 0; i < ranges.length; i++){
        curr = ranges[i];

        // overlapping
        // curr wholey contains new
        // c --------------
        //      n -----
        if (curr.start <= newRange.start && curr.end >= newRange.end){
            rangeApplied = true;
            break;
        }

        // overlapping
        // curr contained wholey inside new
        // n --------------
        //      c ----
        if (newRange.start <= curr.start && newRange.end >= curr.end){
            curr.start = newRange.start;
            curr.end = newRange.end;
            rangeApplied = true;
            break;
        }

        // overlapping
        // curr left of new
        // c ----------
        //         n -------
        if (curr.start < newRange.start && curr.end >= newRange.start){
            curr.end = newRange.end;
            rangeApplied = true;
            break;
        }

        // overlapping
        // curr right of new
        // n --------
        //       c -------
        if (newRange.start < curr.start && newRange.end >= curr.start){
            curr.start = newRange.start;
            rangeApplied = true;
            break;
        }
    }

    if (!rangeApplied){
        ranges.push(newRange);
    }

    return ranges;
}

export default applyRange;
export { applyRange };