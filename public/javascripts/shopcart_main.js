
$(document).ready(function() {
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    $(".raise").on('click',increase);
    $(".reduce").on('click',increase);
});


//function increase_and_decrease_obj_init(){
//    if(sessionStorage.getItem("in_and_de_obj") == null){
//        sessionStorage.setItem("in_and_de_obj",0);
//    }
//    return   sessionStorage.getItem("in_and_de_obj");
//}


function increase() {

    var bar = $(this).data("barcode"),commodity_name = $(this).data("name");
    var category_name = $(this).data("category"),commodity_count = $(this).data("count");
    var sub = commodity_name+category_name;

    if(commodity_count>0){

        $.post('/increase',{barcode:bar},function(data) {
            console.log(data);
            console.log(data.item.count,"count");
            console.log(data.subtotalstr,"str");
            $("#"+commodity_name).html(data.item.count);
            $("#"+commodity_name+bar).html(data.item.subtotalstr);
            sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);

            $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
            //$('#'+sub).html(subtotal);
            //$(".subtotal").html(subtotal_string());
            //item =data;
        });
        //console.log(item,'+');
        //$("#"+commodity_name).html(4);
        //$("#"+commodity_name+bar).html(200);
        //$('#'+sub).html(subtotal);
        //$(".subtotal").html(subtotal_string());
        /*var in_obj = {
            barcode:bar,
            count:commodity_count+1
        };
        in_obj_init(in_obj);
        raise_session_obj(in_obj);

        $("#"+commodity_name).html(in_obj.count);
        //$('#'+sub).html(subtotal);
        //$(".subtotal").html(subtotal_string());
*/
        //sessionStorage.setItem("shopcart_number",parseInt(sessionStorage.getItem("shopcart_number"))+1);
        //
        //$(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    }
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










