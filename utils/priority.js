
function Priority(options){
    this.arr = options.initialNodes || [];
    this.prioritize = options.prioritize;

    if (this.arr.length){
        this.add();
    }
}

Priority.prototype.add = function(node){
    var self = this;

    if (node !== undefined){
        this.arr.push(node);
    }

    this.arr
    .sort(function(a, b){
        var firstCompare = self.compare(a, b, self.prioritize[0].name, self.prioritize[0].priority);
        if (0 === firstCompare){
            if (self.prioritize[1]){
                var secondCompare = self.compare(a, b, self.prioritize[1].name, self.prioritize[1].priority);
                return secondCompare;
            }
        }
        return firstCompare;
    });
};

Priority.prototype.pop = function(node){
    return this.arr.shift();
};

Priority.prototype.peek = function(node){
    return this.arr.length ? this.arr[ 0 ] : undefined;
};

Priority.prototype.compare = function(a, b, prop, minOrMax){
    if (minOrMax === 'min'){
        if (a[prop] > b[prop]){
            return 1;
        } else if (a[prop] < b[prop]){
            return -1;
        } else {
            return 0;
        }
    }

    if (minOrMax === 'max'){
        if (a[prop] > b[prop]){
            return -1;
        } else if (a[prop] < b[prop]){
            return 1;
        } else {
            return 0;
        }
    }
};

Priority.prototype.toArray = function(){
    return this.arr;
}

export default Priority;
export {Priority};