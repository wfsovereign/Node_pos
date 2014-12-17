var _ = require('./underscore.js');
var Item = require('./items.js');

function Dispose_inputs() {

}

Dispose_inputs.add_count_to_barcodes = function (inputs_array) {

    var rich_inputs;
    rich_inputs = _.chain(inputs_array).groupBy(function (inp) {
        return inp;
    }).map(function (value, key) {
        return {barcode: key, count: value.length}
    }).value();
    return rich_inputs;
};

Dispose_inputs.add_other_property_to_inputs = function (inputs, items) {
    var have_count_items = _(items).map(function (item) {
        item.count = _.findWhere(inputs,{"barcode": item.barcode}).count;
        item.subtotal = item.count * item.price;
        item.subtotalstr = postfix(item.subtotal);
        return item;

    });
    return have_count_items;
};

function judge_decimal(integer){
    return (Math.ceil(integer) > integer)
}

function postfix(value){
    if(judge_decimal(value)){

        return (value+"0(元)")
    }else{
        return (value+".00(元)")
    }
}



module.exports = Dispose_inputs;

