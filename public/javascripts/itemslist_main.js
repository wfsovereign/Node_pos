


var inputs = [];
function add_input() {
    inputs.push($(this).data("barcode"));
    console.log(inputs);
    sessionStorage.setItem("barcodes",inputs);
    sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));

}
function shopcart_number_display(){
    if(sessionStorage.getItem("shopcart_number") == null){
        sessionStorage.setItem("shopcart_number",0);
    }
    return   sessionStorage.getItem("shopcart_number");
}

/*



inputs_init();
var inputs = JSON.parse(sessionStorage.getItem("barcodes"));
inputs.push($(this).data("barcode"));
//sessionStorage.setItem("barcodes",JSON.stringify(JSON.parse(sessionStorage.getItem("barcodes")).push($(this).data("barcode"))));
console.log(inputs);
sessionStorage.setItem("barcodes",inputs);
sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);
$(".shopcart_num").html(parseInt(sessionStorage.getItem("shopcart_number")));*/

$(document).ready(function(){
    $(".add").on('click',add_input);
    $(".shopcart_num").html(shopcart_number_display());
});