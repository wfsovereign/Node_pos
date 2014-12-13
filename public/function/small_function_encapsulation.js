
function rich_promotion_purchase_commodity(){
    _.each(cart_items,function(item){
        add_preferential_information_to_item(item);
    });
    _.each(cart_items,function(item){
        if(item.preference_information =='BUY_TWO_GET_ONE_FREE'){
            item.givecount = Math.floor(item.count/3)
        }
    });
    _.each(cart_items,function(item){
        if(item.preference_information != undefined){
            item.subtotal = item.count*item.price;
            item.subtotal_after_promotion = (item.count-item.givecount)*item.price;
        }else{
            item.subtotal = item.count*item.price;
        }
    });
    _.each(cart_items,function(item){
        if(item.givecount>0){
            item.subtotalstr = postfix_to_subtotal_after_promotion(item);
        }else{
            item.subtotalstr = postfix(item.subtotal);
        }
    });
}

function add_preferential_information_to_item(item){
    var promote = loadPromotions();
    _.each(promote,function(pro){
        var judge_bar=_.find(pro.barcodes,function(p){
            if(p ==item.barcode){
                return p;
            }
        });
        if(judge_bar !=undefined) {
            item.preference_information = pro.type;
        }
    });
}

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

function postfix_to_subtotal_after_promotion(item){
    var display_subtotal="";
    display_subtotal = postfix(item.subtotal_after_promotion)+"(原价："+postfix(item.subtotal)+")";
    return display_subtotal
}

function subtotal_string(){
    var subtotal=0;
    _.each(cart_items,function(item){
        subtotal+=item.subtotal;
    });
    subtotal="总计："+postfix(subtotal);
    return subtotal
}

function judge_exist_promotion_commodity() {
    var promote = loadPromotions();
    var judge_item_belong_promote = [];
    _.each(cart_items,function(item){
        judge_item_belong_promote.push(judge_exist_barcode(item,promote))
    });
    var item_truth= _.find(judge_item_belong_promote,function(truth){
        if(truth == true){
            return true
        }
    });
    return item_truth != undefined
}

function judge_exist_barcode(item,promote){
    var judge_bar;
    _.each(promote,function(pro){
        judge_bar=_.find(pro.barcodes,function(p){
            if(p ==item.barcode){
                return p;
            }
        });
    });
    return judge_bar != undefined
}

function update_givecount(){
    _.each(cart_items,function(item){
        if(item.preference_information =='BUY_TWO_GET_ONE_FREE'){
            item.givecount = Math.floor(item.count/3)
        }
    });
}
