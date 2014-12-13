/**
 * Created by wfsovereign on 14-11-19.
 */
var cart_items =JSON.parse(sessionStorage.getItem("commodity_cart_items"));

console.log(cart_items);


$(function(){
    $(".commodity_list").append(main_body_output());
    $(".shopcart_num").html(sessionStorage.getItem("shopcart_number"));
    $(".confirm-payment").click(reset_shopcart());
    //$(".details").append(promotion_commodity_frame_output());
   // $(".promotionlist").append(promotion_commodity_output());
});

function reset_shopcart(){
    sessionStorage.clear();
}


function main_body_output(){
    if(judge_exist_promotion_commodity()==false){
        var mainbody_string;
        mainbody_string=not_promotion_commodity_output();
        $(".subtotal").html(subtotal_string());
        return mainbody_string;
    }else{

        //rich_promotion_purchase_commodity();
        var body_string = promotion_after_purchase_commodity_output();
        $(".subtotal").html(subtotal_string());
        if(judge_exist_savemoney() ==true){
            $(".details").append(promotion_commodity_frame_output());
            $(".promotionlist").append(promotion_commodity_output());
            $(".savemoney").html(savemoney_string());
            $(".actualpayment").html(actualpayment_string());
        }
        return body_string;
    }
}


function savemoney_string(){
    var savemoney=0;
    _.each(cart_items,function(item){
        if(item.givecount>0){
            savemoney+=item.price*item.givecount;
        }
    });
    savemoney="节省："+postfix(savemoney);
    return savemoney
}

function actualpayment_string(){
    var actualpayment =0;
    _.each(cart_items,function(item){
        if(item.subtotal_after_promotion!=undefined &&item.subtotal_after_promotion != item.subtotal){
            actualpayment+=item.subtotal_after_promotion;
        }else{
            actualpayment+=item.subtotal;
        }
    });
    actualpayment="实付："+postfix(actualpayment);
    return actualpayment
}

function promotion_after_purchase_commodity_output(){
    var body_string;
    body_string="";
    _.each(cart_items,function(item){
        if(item.givecount>0){
            body_string=body_string+
                "<tr ><td>" +item.category+
                "</td><td>" +item.name+
                "</td><td>" +item.price+
                "</td><td>" +item.unit+
                "</td><td>" +item.count+
                "</td><td>" +item.subtotalstr+
                "</td></tr>";
        }else if(item.count>0){
            body_string=body_string+
                "<tr ><td>" +item.category+
                "</td><td>" +item.name+
                "</td><td>" +item.price+
                "</td><td>" +item.unit+
                "</td><td>" +item.count+
                "</td><td>" +item.subtotalstr+
                "</td></tr>";
        }
    });
    return body_string
}


function not_promotion_commodity_output(){

    var commodity_string="";
    _.each(cart_items,function(item){
        commodity_string=commodity_string+
            "<tr ><td>" +item.category+
            "</td><td>" +item.name+
            "</td><td>" +item.price+
            "</td><td>" +item.unit+
            "</td><td>" +item.count+
            "</td><td>" +item.subtotalstr+
            "</td></tr>";
    });
    return commodity_string;
}





function promotion_commodity_frame_output(){
    var mainbody_strings="";
    mainbody_strings += "<div class= 'panel-heading' style='background-color: lightgrey'><h3 class='text-left'>赠送商品</h3></div> "+
        "<div class='panel-body'><table  class='table table-bordered text-center'><thead class='promotionlist' >"+
        "<tr ><td class='col-md-2'>分类</td><td class='col-md-3'>名称</td><td class='col-md-2'>数量</td></tr>"+
        "</thead></table></div>";
    return mainbody_strings;
}

function promotion_commodity_output(){
    var mainbody_strings="";
    _.each(cart_items,function(item){
        if(item.givecount!= undefined &&item.givecount!=0){
            mainbody_strings=mainbody_strings+
                "<tr ><td>" +item.category+
                "</td><td>" +item.name+
                "</td><td>" +item.givecount+
                "</td></tr>";
        }
    });
    return mainbody_strings;
}



function judge_exist_savemoney(){
    var judge_value;
    _.each(cart_items,function(item){
        if(item.givecount>0){
            judge_value = true
        }
    });
    return judge_value
}

