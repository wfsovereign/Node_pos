
var Item = require('../models/items.js');

var build_inputs_array = require('../models/shopcart_main.js');


module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('index' );
    });
    app.get('/itemslist', function (req, res) {
        Item.get_items(function(err,items){
            if(err){
                items = [];
            }
            res.render('itemslist',{
                items:items
            });
        });
    });
    app.get('/shopcart', function (req, res) {

        res.render('shopcart');
    });
    app.post('/shopcart',function(req,res){
        req.session.allinputs = req.body.inputs;
        req.session.add_count_inputs = build_inputs_array(req.session.allinputs);

    });
    app.get('/details', function (req, res) {
        res.render('details');
    });
    app.get('/abs', function (req, res) {
        res.send('hello world');
    });

    app.get('/admin',function(req,res){
        Item.get_items(function(err,items){
            if(err){
                items = [];
            }
            res.render('admin',{
                items:items,
                success: req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });

    });
    app.post('/admin',function(req,res){

        if(req.body.barcode !="" && req.body.name !="" && req.body.price != "" && req.body.category != ""){
            var item = new Item(req.body.barcode,req.body.name, req.body.price,req.body.unit, req.body.category);
            item.save(function(err,item){
                if(err){
                    return res.redirect('/admin');
                }
                req.session.item = item;
                res.redirect('/admin')
            });
        }else{
            req.flash('error','非法提交,请检查!');
            res.redirect('/admin')
        }



    })

};
