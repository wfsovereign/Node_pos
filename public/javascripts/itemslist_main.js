

function add_input() {
    var inputs = JSON.parse(sessionStorage.getItem("barcodes"));
    inputs.push($(this).data("barcode"));
    sessionStorage.setItem("barcodes",JSON.stringify(inputs));
    sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
}

function shopcart_number_display(){
    if(sessionStorage.getItem("shopcart_number") == null){
        sessionStorage.setItem("shopcart_number",0);
    }
    return   sessionStorage.getItem("shopcart_number");
}


function transfer_inputs_to_server() {

    var inputs = JSON.parse(sessionStorage.getItem('barcodes'));
    //sessionStorage.setItem("barcodes",JSON.stringify([]));
    $.post('/shopcart',{'inputs':inputs},function(data){
        window.location.href = "/shopcart";
    });

}

$(document).ready(function(){
    $(".add").on('click',add_input);
    $(".shopcart_num").html(shopcart_number_display());
    $(".shopcart").on('click',transfer_inputs_to_server);

});