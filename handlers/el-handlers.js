
function elKeydownHandler(self){
    return function(e){
        // http://www.quirksmode.org/js/keys.html

        // hot keys
        if (e.metaKey || e.ctrlKey){
            switch (e.keyCode){
                case 73: // i
                    // self.applyStyle({name: 'fontStyle', value: 'italic'});
                case 66: // b
                    // self.applyStyle({name: 'fontWeight', value: 700});
                case 85: // u
                    // self.applyStyle({name: 'textDecoration', value: 'underline'});
                    return false;
                    break;
            }
        }

        switch (e.keyCode) {

            // ARROWS
            case 37: // left
            case 39: // right
            case 38: // up
            case 40: // down
                break;

            case 13: // enter === will split block later
                break;

            case 27: // escape
            case 16: // shift
            case 18: // alt / option
            case 91: // command/meta
            case 93: // command/meta
                break;

            // case 9: // tab
                // break;
            // case ??: // fn ?
            // fn keys?

            // FOCUS THE INPUT BOX
            case 46: // backspace
            case 8:  // delete --- need to handle when its the first character of a block???
            default:
                self.focusInput();
        }
        return true;
    };
}

export {
    elKeydownHandler
};