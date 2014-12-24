/**
 * Created by wfsovereign on 14-12-24.
 */


$(function () {
    $(".confirm_payment").on('click', confirm_payment);
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
});

function confirm_payment() {
    console.log("12345");
    sessionStorage.setItem("barcodes",JSON.stringify([]));
    sessionStorage.setItem("shopcart_number",0);
    $.post('/reset', function (data) {
        window.location.href = "/";
    })
}
