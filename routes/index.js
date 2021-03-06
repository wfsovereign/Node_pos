var Item = require('../models/items.js');
var Promotion = require('../models/promotion.js');
var _ = require('../models/underscore.js');
var Dispose_inputs = require('../models/dispose_inputs.js');

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
function add_promotion_from_promotion(item, promo) {
    _(promo).each(function (pro) {
        var judge_bar = _(pro.barcode).find(function (p) {
            if (p == item.barcode) {
                return p;
            }
        });
        if (judge_bar != undefined) {
            item.promotion = pro.type;
        }
    });
}

function add_promotion_info(items, promo) {
    _(items).each(function (item) {

        add_promotion_from_promotion(item, promo);
    })
}

function calculate_gift(items) {
    _(items).each(function (item) {
        if (item.promotion == "buy two get one" && item.count > 2) {
            item.gift_count = Math.floor(item.count / 3);
            item.subtotalstr = postfix((item.count - item.gift_count) * item.price) + "(原价:" + postfix(item.subtotal) + ")"
        }
        if (item.promotion == "buy ten get one" && item.count > 10) {
            item.gift_count = Math.floor(item.count / 11);
            item.subtotalstr = postfix((item.count - item.gift_count) * item.price) + "(原价:" + postfix(item.subtotal) + ")"
        }
    })

}


function Increase_multiply_promotion_info(items, promo) {
    if (items[0].increase == 'true') {
        console.log("not increase");
        return items;
    } else {
        console.log("increase");
        add_promotion_info(items, promo);
        calculate_gift(items);
        return items;
    }

}

function add_string_to_items_subtotal(value) {
    return "总计:" + postfix(value)
}

function add_string_to_gift_items_subtotal(value) {
    return "节省:" + postfix(value)
}
function caculate_item_subtotal(items) {
    var item_subtotal = 0;
    _(items).each(function (item) {
        item_subtotal += item.subtotal;
    });
    return item_subtotal;
}
function calculate_gift_and_substr_to_item(item) {
    item.subtotal = item.count * item.price;
    item.subtotalstr = postfix(item.subtotal);
    if (item.promotion == "buy two get one" && item.count > 2) {
        item.gift_count = Math.floor(item.count / 3);
        item.subtotalstr = postfix((item.count - item.gift_count) * item.price) + "(原价:" + postfix(item.subtotal) + ")"
    }
    if (item.promotion == "buy ten get one" && item.count > 10) {
        item.gift_count = Math.floor(item.count / 11);
        item.subtotalstr = postfix((item.count - item.gift_count) * item.price) + "(原价:" + postfix(item.subtotal) + ")"
    }
}

function judge_exist_present(items) {
    var judge_exist_present_result;
    _(items).find(function (item) {
        if (item.gift_count > 0) {
            judge_exist_present_result = true;
        }
    });
    return judge_exist_present_result;
}

function produce_gift_items(items) {
    return _(items).filter(function (item) {
        return item.gift_count > 0
    })
}
function caculate_gift_items_subtotal(items) {
    var gift_items_sutotal =0;
    _(items).each(function(item) {
        gift_items_sutotal+=item.gift_count*item.price;
    });
    return gift_items_sutotal;
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
        Promotion.get_all_promotion(function (err, promo) {
            if (err) {
                promo = [];
            }
            req.session.basic_items = Increase_multiply_promotion_info(req.session.basic_items, promo);
            req.session.items_subtotal = caculate_item_subtotal(req.session.basic_items);

            console.log(req.session.basic_items, "__________________________-");
            res.render('shopcart', {
                items: req.session.basic_items,
                items_subtotalstr: add_string_to_items_subtotal(req.session.items_subtotal)
            });
        });
    });

    app.post('/shopcart', function (req, res) {
        req.session.allinputs = req.body.inputs;
        if (req.session.basic_items == undefined) {
            req.session.basic_items = [];
        }

        if (req.session.allinputs != undefined) {
            Item.get_item_from_barcode(req.session.allinputs, function (err, item) {
                if (err) {
                    console.log("error 1");
                }
                var have_count_inputs = Dispose_inputs.add_count_to_barcodes(req.session.allinputs);
                req.session.basic_items = Dispose_inputs.add_other_property_to_inputs(have_count_inputs, item);
                res.end();
            });
        } else {
            console.log("empty inputs");
            res.end();
        }
    });




    app.post('/increase', function (req, res) {
        var bar = req.body.barcode;
        var items = req.session.basic_items;
        _(items).find(function (item) {
            if (item.barcode == bar) {
                item.count += 1;
                req.session.items_subtotal = req.session.items_subtotal + parseInt(item.price);
                console.log(req.session.items_subtotal, "subtotal");
                calculate_gift_and_substr_to_item(item);
                res.json({
                    item: item,
                    items_subtotal: req.session.items_subtotal
                });
                //res.end();
            }
        });
        req.session.basic_items = items;
    });
    app.post('/decrease', function (req, res) {
        var bar = req.body.barcode;
        var items = req.session.basic_items;
        _(items).find(function (item) {
            if (item.barcode == bar) {
                item.count -= 1;
                req.session.items_subtotal = req.session.items_subtotal - parseInt(item.price);
                calculate_gift_and_substr_to_item(item);
                res.json({
                    item: item,
                    items_subtotal: req.session.items_subtotal
                });
               // res.end();
            }
        });
        req.session.basic_items = items;
    });



    app.get('/details', function (req, res) {

        res.render('details', {
            items: req.session.basic_items,
            present: judge_exist_present(req.session.basic_items),
            gift_items:produce_gift_items(req.session.basic_items),
            subtotal:add_string_to_items_subtotal(req.session.items_subtotal),
            gift_subtotal:add_string_to_gift_items_subtotal(caculate_gift_items_subtotal(produce_gift_items(req.session.basic_items)))
        });
    });

    app.post('/reset', function (req, res) {
        console.log("____________________");
        req.session.basic_items =null;
        req.session.items_subtotal =null;
        res.end();

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

    app.get('/admins', function (req, res) {
        Promotion.get_all_promotion(function (err, promo) {
            if (err) {
                promo = [];

            }
            console.log(promo);
            res.render('admins', {
                promotion: promo,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    });
    app.post('/admins', function (req, res) {
        var type = new Promotion(req.body.promotion_type);
        type.save(function (err, type) {
            if (err) {
                return res.redirect('/admins');
            }
            req.session.promotion = type;
            res.redirect('/admins')

        })
    });


    app.get('/adminp', function (req, res) {
        Promotion.get_all_promotion(function (err, promo) {
            if (err) {
                promo = [];
            }
            res.render('adminp', {
                promotion: promo,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    });

    app.post('/adminp', function (req, res) {

        console.log(req.body.promotion_type, req.body.barcode, "-----------");
        var promotion = new Promotion(req.body.promotion_type, req.body.barcode);
        promotion.update_barcode(function (err, promo) {
            if (err) {
                return res.redirect('/adminp');
            }
            req.session.promotion = promo;
            res.redirect('/adminp')
        })
    })

};











