
var inputs = [];
function add_input() {
    inputs.push($(this).data("barcode"));
    console.log(inputs);
}





$(document).ready(function(){
    $(".add").on('click',add_input);
    //$(".shopcart_num").html(shopcart_number_display());
});