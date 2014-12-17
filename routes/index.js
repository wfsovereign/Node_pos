var Item = require('../models/items.js');
var _ = require('../models/underscore.js');
var Dispose_inputs = require('../models/dispose_inputs.js');


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

        console.log(req.session.basic_items, "basic items");
        res.render('shopcart',{
            items:req.session.basic_items
        });

    });
    app.post('/shopcart', function (req, res) {
        req.session.allinputs = req.body.inputs;
        //req.session.add_count_inputs = build_inputs_array(req.session.allinputs);
        req.session.basic_items = [];
        console.log("set up");


        Item.get_item_from_barcode(req.session.allinputs, function (err, item) {
            if (err) {
                console.log("error 1");
            }
            var have_count_inputs = Dispose_inputs.add_count_to_barcodes(req.session.allinputs);

            req.session.basic_items = Dispose_inputs.add_other_property_to_inputs(have_count_inputs,item);
            console.log(req.session.basic_items, "item");
            res.redirect('shopcart');
        });


    });

    /*
     _(req.session.add_count_inputs).each(function (element) {
     Item.get_item_from_barcode(element.barcode, function (err, item) {
     if (err) {
     console.log("error");
     }
     //var basic_item = {
     //    barcode: item.barcode,
     //    name: item.name,
     //    count: element.count,
     //    unit: item.unit,
     //    category: item.category,
     //    price: item.price
     //};
     console.log(item, "item");
     req.session.basic_items.push(item);
     })
     });
     });*/

    app.get('/details', function (req, res) {
        res.render('details');
    });
    app.get('/abs', function (req, res) {
        res.send('hello world');
    });

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
        } else {
            req.flash('error', '非法提交,请检查!');
            res.redirect('/admin')
        }


    })

};
