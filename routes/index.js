var Item = require('../models/items.js');
var Promotion = require('../models/promotion.js');
var _ = require('../models/underscore.js');
var Dispose_inputs = require('../models/dispose_inputs.js');

function judge_decimal(integer){
    return (Math.ceil(integer) > integer)
}
function postfix(value){
    if(judge_decimal(value)){

        return (value+"0(元)")
    }else{
        return (value+".00(元)")
    }
}
function add_promotion_from_promotion(item,promo) {
    _(promo).each(function(pro) {
        var judge_bar = _(pro.barcode).find(function(p){
            if(p == item.barcode){
                return p;
            }
        });
        if(judge_bar != undefined) {
            item.promotion = pro.type;
        }
    });
}

function add_promotion_info(items, promo) {
    _(items).each(function (item) {
        add_promotion_from_promotion(item,promo);
    })
}

function calculate_gift(items) {
    _(items).each(function(item) {
        if(item.promotion == "buy two get one" && item.count>2) {
            item.gift_count = Math.floor(item.count/3);
            item.subtotalstr = postfix((item.count-item.gift_count)*item.price) + "(原价:" + postfix(item.subtotal) +")"
        }
        if(item.promotion == "buy ten get one" && item.count>10) {
            item.gift_count = Math.floor(item.count/11);
            item.subtotalstr = postfix((item.count-item.gift_count)*item.price) + "(原价:" + postfix(item.subtotal) +")"
        }
    })

}


function Increase_multiply_promotion_info(items,promo) {
    add_promotion_info(items,promo);
    calculate_gift(items);
    return items;
}




module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/itemslist', function (req, res) {
        Item.get_items(function (err, items) {
            if (err) {
                items = [];
            }

            res.render('itemslist', {
                items: items
            });
        });
    });

    app.get('/shopcart', function (req, res) {
        Promotion.get_all_promotion(function(err,promo) {
            if(err) {
                promo =[];
            }
            req.session.basic_items = Increase_multiply_promotion_info(req.session.basic_items,promo);
            console.log(req.session.basic_items,"__________________________-");
            res.render('shopcart', {
                items: req.session.basic_items
            });
        });
    });

    app.post('/shopcart', function (req, res) {
        req.session.allinputs = req.body.inputs;

        Item.get_item_from_barcode(req.session.allinputs, function (err, item) {
            if (err) {
                console.log("error 1");
            }
            if(req.session.basic_items == undefined){

                req.session.basic_items = [];
                var have_count_inputs = Dispose_inputs.add_count_to_barcodes(req.session.allinputs);
                req.session.basic_items = Dispose_inputs.add_other_property_to_inputs(have_count_inputs, item);
                res.end();
            }else{
                console.log(req.session.basic_items,"+++++++++++++++++++++=");

                //console.log(req.session.basic_items);
                var has_count_inputs = Dispose_inputs.add_count_to_barcodes(req.session.allinputs);
                //var items = req.session.basic_items;
                add_count_from_have_count_inputs_to_alreadyexists_items(req.session.basic_items,has_count_inputs);
                //_(req.session.basic_items).each(function(item) {
                //    calculate_gift_to_item(item);
                //})
                var after_del_repeition_count_inputs = del_repetition_in_have_count_inputs(has_count_inputs);
                //console.log(after_del_repeition_count_inputs,"1111111111111111");
                var new_items = Dispose_inputs.add_other_property_to_inputs(has_count_inputs,item);
                _(new_items).each(function(item) {
                    req.session.basic_items.push(item);
                });
                //console.log(req.session.basic_items);
                //req.session.basic_items.push(Dispose_inputs.add_other_property_to_inputs(has_count_inputs,item));
                res.end();
            }


        });
    });
    function add_count_from_have_count_inputs_to_alreadyexists_items(items,count_inputs){
        _(items).each(function(item) {
            var count = 0;
            _(count_inputs).find(function(bar) {
                if(bar.barcode ==item.barcode){
                    item.count +=bar.count;
                    bar.mark = count;
                }
                count++;
            })
        });
    }
    function del_repetition_in_have_count_inputs(count_inputs) {
        //var after_del_repetition_have_count_inputs = _(count_inputs).filter(function(inp) {
        //    return inp.mark == undefined
        //});
        return _(count_inputs).filter(function(inp) {
            return inp.mark == undefined
        });
    }

    function calculate_gift_to_item(item) {
            item.count +=1;
            item.subtotal = item.count * item.price;
            item.subtotalstr = postfix(item.subtotal);

            if(item.promotion == "buy two get one" && item.count>2) {
                item.gift_count = Math.floor(item.count/3);
                item.subtotalstr = postfix((item.count-item.gift_count)*item.price) + "(原价:" + postfix(item.subtotal) +")"
            }
            if(item.promotion == "buy ten get one" && item.count>10) {
                item.gift_count = Math.floor(item.count/11);
                item.subtotalstr = postfix((item.count-item.gift_count)*item.price) + "(原价:" + postfix(item.subtotal) +")"
            }
        return item

    }
    app.post('/increase',function(req,res) {
        var bar = req.body.barcode;
        var items = req.session.basic_items;
        _(items).find(function(item) {
            if(item.barcode == bar ) {

                calculate_gift_to_item(item);
                res.json({item:item})
            }
        });
        req.session.basic_items = items;


    });

    app.get('/details', function (req, res) {
        res.render('details');
    });
    app.get('/abs', function (req, res) {
        res.send('hello world');
    });




    //管理员页面
    app.get('/admin', function (req, res) {
        Item.get_items(function (err, items) {
            if (err) {
                items = [];
            }
            res.render('admin', {
                items: items,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });

    });
    app.post('/admin', function (req, res) {

        if (req.body.barcode != "" && req.body.name != "" && req.body.price != "" && req.body.category != "") {
            var item = new Item(req.body.barcode, req.body.name, req.body.price, req.body.unit, req.body.category);
            item.save(function (err, item) {
                if (err) {
                    return res.redirect('/admin');
                }
                req.session.item = item;
                res.redirect('/admin')
            });
        }


        req.flash('error', '非法提交,请检查!');
        res.redirect('/admin')


    });

    app.get('/admins',function(req,res) {
        Promotion.get_all_promotion(function(err,promo){
            if(err) {
                promo = [];

            }
            console.log(promo);
            res.render('admins',{
                promotion:promo,
                success:req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    });
    app.post('/admins',function(req,res) {
        var type = new Promotion(req.body.promotion_type);
        type.save(function(err,type) {
            if(err) {
                return res.redirect('/admins');
            }
            req.session.promotion = type;
            res.redirect('/admins')

        })
    });



    app.get('/adminp',function(req,res) {
        Promotion.get_all_promotion(function(err,promo){
            if(err) {
                promo = [];
            }
            res.render('adminp',{
                promotion:promo,
                success:req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    });

    app.post('/adminp',function(req,res) {

        console.log(req.body.promotion_type,req.body.barcode,"-----------");
        var promotion = new Promotion(req.body.promotion_type,req.body.barcode);
        promotion.update_barcode(function(err,promo) {
            if(err) {
                return res.redirect('/adminp');
            }
            req.session.promotion = promo;
            res.redirect('/adminp')
        })
    })


};











