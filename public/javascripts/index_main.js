
function inputs_init(){
    if(sessionStorage.getItem("barcodes") == null){
        var inputs=[];
        sessionStorage.setItem("barcodes",JSON.stringify(inputs));
    }
}

$(document).ready(function(){
    $(".inputs_init").on("click",inputs_init());
});