/**
 * Created by wfsovereign on 14-11-12.
 */





$(document).ready(function(){
    $(".items_list").append(table_output());
    $(".add").on('click',storage_bar);
    $(".shopcart_num").html(shopcart_number_display())
});

function shopcart_number_display(){
    if(sessionStorage.getItem("shopcart_number") == null){
        sessionStorage.setItem("shopcart_number",0);
    }
    return   sessionStorage.getItem("shopcart_number");
}

function inputs_init(){
    if(sessionStorage.getItem("barcodes") == null){
        var inputs=[];
        sessionStorage.setItem("barcodes",JSON.stringify(inputs));
    }
}

function storage_bar(){
    inputs_init();
    var inputs = JSON.parse(sessionStorage.getItem("barcodes"));
    inputs.push($(this).data("barcode"));
    sessionStorage.setItem("barcodes",JSON.stringify(inputs));
    var shopcart_num= parseInt(sessionStorage.getItem("shopcart_number"));
    shopcart_num+=1;
    sessionStorage.setItem("shopcart_number",shopcart_num);
    sessionStorage.setItem("shopcart_number",shopcart_num);
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));

}

function table_output() {
    var allitem= loadAllItems();
    var out = "";
    _.each(allitem, function (item) {
        out = out +
            '<tr>' +
            '<td>' + item.category + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.price + '</td>' +
            '<td>' + item.unit + '</td> ' +
            "<td><button class='add btn btn-primary' data-barcode = '"+item.barcode+"'>加入购物车</button>" + '</td>' +
            '</tr>'
    });
    return out;
}