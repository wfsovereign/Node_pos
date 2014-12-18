
$(document).ready(function() {
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));

});





function raise(){
    var current_commodity_number= 0;
    var bar = $(this).data("barcode");
    var commodity_name = $(this).data("name");
    var category_name = $(this).data("category");
    var sub = commodity_name+category_name;
    _.each(cart_items,function(item){
        if(item.barcode == bar){
            raise_update_item(item);
            current_commodity_number = item.count;
            subtotal = item.subtotalstr;
        }
    });
    if(current_commodity_number>0){
        sessionStorage.setItem("commodity_cart_items",JSON.stringify(cart_items));
        sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);
        var inputs = JSON.parse(sessionStorage.getItem("barcodes"));
        inputs.push(bar);
        sessionStorage.setItem("barcodes",JSON.stringify(inputs));
        $("#"+commodity_name).html(current_commodity_number);
        $('#'+sub).html(subtotal);
        $(".subtotal").html(subtotal_string());
        $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    }
}