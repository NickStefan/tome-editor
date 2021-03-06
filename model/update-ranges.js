
function updateRanges(ranges, index, length){

    var updated = [];
    var current;

    for (var i = 0; i < ranges.length; i++){
        current = ranges[i];

        // if adding text
        if (length >= 0){

            // previously shrunk range, now to be expanded
            if (index === current.start && index === current.end){
                current.end += length;
            }

            // if index is left of start, change start and end by length
            // i
            //     c --------------
            else if (index <= current.start){
                current.start += length;
                current.end += length;
            }

            // if index is right of start, but left of end, change end by length
            //       i
            // c ----------
            else if (index >= current.start && index <= current.end){
                current.end += length;
            }

            // if index is right of end, do nothing
            //           i
            //  c ----
            else {
                // do nothing
            }

        // removing text
        } else {

            if (index === current.start && index === current.end){
                // do nothing, delete this range
                continue;
            }

            // if index is left of start, change start and end by length
            // i
            //     c --------------
            else if (index <= current.start){
                current.start += length;
                current.end += length;
            }

            // if index is right of start, but left of end, change end by length
            //       i
            // c ----------
            else if (index >= current.start && index <= current.end){
                // but what if the index change goes leftward past start of c?
                if (current.start > (index + length) && index === current.end){
                    // delete range, dont push to update
                    continue;
                } else if (current.start > (index + length)){
                    current.start += length;
                    if (current.start < 0){
                        current.start = 0;
                    }
                }
                current.end += length;
            }

            // if index is right of end, do nothing
            //           i
            //  c ----
            else {
                // but what if the index change goes leftward past end of c?
                // if goes past c end, change end by length
                if (current.end > (index + length)){
                    current.end = index + length;
                }

                // but what if the index change goes leftward past start of c?
                if (current.start >= (index + length)){
                    // delete range, dont push to update
                    continue;
                }
            }
        }

        updated.push(current);
    }

    return updated;
}

function updateBlockRanges(blockRanges, index, length){
    var ranges = {};
    for (var key in blockRanges){
        ranges[key] = updateRanges(blockRanges[key], index, length);
    }
    return ranges;
}

export default updateRanges;
export {updateRanges, updateBlockRanges};