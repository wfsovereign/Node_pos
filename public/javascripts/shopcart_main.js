
function judge_decimal(integer) {
    return (Math.ceil(integer) > integer)
}
function postfix(value) {
    if (judge_decimal(value)) {

        return (value + "0(元)")
    } else {
        return (value + ".00(元)")
    }
}
function substract_barcode_from_inputs(inputs,bar) {
    var count=0;
    _(inputs).find(function(barcode) {
        if(barcode == bar){
            return true
        }
        count ++;
    });
    inputs.splice(count,1);
    return inputs;
}

function add_string_to_items_subtotal(value) {
    return "总计:" + postfix(value)
}

function decrease() {
    var bar = $(this).data("barcode"),commodity_name = $(this).data("name");
    if($("#"+commodity_name).html()>0){
        var inputs = JSON.parse(sessionStorage.getItem("barcodes"));
        sessionStorage.setItem("barcodes",JSON.stringify(substract_barcode_from_inputs(inputs,bar)));
        $.post('/decrease',{barcode:bar},function(data) {
            $("#"+commodity_name).html(data.item.count);
            $("#"+commodity_name+bar).html(data.item.subtotalstr);
            $(".subtotal").html(add_string_to_items_subtotal(data.items_subtotal));
        });
        sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))-1);
        $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));

    }

}


$(document).ready(function() {
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    $(".raise").on('click',increase);
    $(".reduce").on('click',decrease);
});


//function increase_and_decrease_obj_init(){
//    if(sessionStorage.getItem("in_and_de_obj") == null){
//        sessionStorage.setItem("in_and_de_obj",0);
//    }
//    return   sessionStorage.getItem("in_and_de_obj");
//}



function increase() {
    var bar = $(this).data("barcode"),commodity_name = $(this).data("name");
        var inputs = JSON.parse(sessionStorage.getItem("barcodes"));
        inputs.push(bar);
        sessionStorage.setItem("barcodes",JSON.stringify(inputs));
        console.log($(".subtotal").html());
        $.post('/increase',{barcode:bar},function(data) {
            console.log(data.items_subtotal);
            $("#"+commodity_name).html(data.item.count);
            $("#"+commodity_name+bar).html(data.item.subtotalstr);
            $(".subtotal").html(add_string_to_items_subtotal(data.items_subtotal))
        });
        sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);
        $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));


}

/*
function in_obj_init(in_obj) {
    var operate_to_shopcart = JSON.parse(sessionStorage.getItem("in_and_de_obj"));
    if(judge_exist_barcode(in_obj,operate_to_shopcart)) {
        _(operate_to_shopcart).find(function(oper) {
            if(oper.barcode == in_obj.barcode) {
                in_obj.count = oper.count + 1;
            }
        });
    }
}

function judge_exist_barcode(in_obj,operate_to_shopcart) {
    var judge_bar;
    judge_bar = _(operate_to_shopcart).find(function(oper) {
        if(oper.barcode == in_obj.barcode) {
            return oper
        }
    });
    return judge_bar !=undefined
}


function raise_session_obj(in_obj){
    var operate_to_shopcart = JSON.parse(sessionStorage.getItem("in_and_de_obj"));
    if(judge_exist_barcode(in_obj,operate_to_shopcart)){
        _(operate_to_shopcart).find(function(oper) {
            if(oper.barcode == in_obj.barcode) {
                oper.count = in_obj.count
            }
        });
        sessionStorage.setItem("in_and_de_obj",JSON.stringify(operate_to_shopcart));
    }else {
        operate_to_shopcart.push(in_obj);
        sessionStorage.setItem("in_and_de_obj",JSON.stringify(operate_to_shopcart));
    }
}
*/










