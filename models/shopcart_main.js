var _ = require('./underscore.js');
var Item = require('./items.js');

function find_item_by_barcode(barcode,allitems) {
    return _(allitems).findWhere({"barcode":barcode})
}

function build_cart_items_from_inputs(inputs_array){

    var purchase_commodity_list;
    purchase_commodity_list=_.chain(inputs_array).groupBy(function(inp){
        return inp;
    }).map(function(value,key){
        return {barcode:key,count:value.length}
    }).value();
    return purchase_commodity_list;
}
function add_other_property_to_inputs(have_count_inputs){
    _(have_count_inputs).map(function(element) {
        Item.get_item_from_barcode(element.barcode,function(err,item){
            if(err){
                
            }
        })
    })
}


module.exports = build_cart_items_from_inputs;


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
