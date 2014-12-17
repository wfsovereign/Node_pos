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
        return item;

    });
    return have_count_items;
};


//function add_count_to_barcodes(inputs_array) {
//
//    var  rich_inputs;
//    rich_inputs = _.chain(inputs_array).groupBy(function (inp) {
//        return inp;
//    }).map(function (value, key) {
//        return {barcode: key, count: value.length}
//    }).value();
//    return rich_inputs;
//}


module.exports = Dispose_inputs;


/*
 .map(function(element){
 var item = find_item_by_barcode(element.barcode,all_items);
 return{
 barcode:item.barcode,
 name:item.name,
 count:element.count,
 unit:item.unit,
 category:item.category,
 price:item.price
 }
 })*/
