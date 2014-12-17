var mongodb = require('./db');
var _ = require('../models/underscore.js');

function Items(barcode, name, price, unit, category) {
    this.barcode = barcode;
    this.name = name;
    this.price = price;
    this.unit = unit;
    this.category = category;
}


Items.prototype.save = function (callback) {
    var item = {
        barcode: this.barcode,
        name: this.name,
        price: this.price,
        unit: this.unit,
        category: this.category
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('items', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(item, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};

Items.get_items = function (callback) {

    mongodb.open(function (err, db) {

        if (err) {

            return callback(err);
        }
        db.collection('items', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.find().toArray(function (err, docs) {
                mongodb.close();
                if (err) {

                    return callback(err);
                }
                callback(null, docs);
            })
        })
    })

};

Items.get_item_from_barcode = function (inputs, callback) {

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('items', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }


            collection.find({
                barcode: {"$in": inputs}
            }).toArray(function (err, item) {

                if (err) {
                    console.log(err);
                    return callback(err);
                }
                callback(null,item);
                mongodb.close();

            });
        });
        //});

        //        collection.findOne({
        //            barcode: input.barcode
        //        }, function (err, item) {
        //            //console.log(item.name);
        //            mongodb.close();
        //            if (err) {
        //
        //                return callback(err);
        //            }
        //            item.count = input.count;
        //            callback(null, item);
        //            console.log(item.name,"name");
        //
        //        });
        //    })
        //});


    })
    };


    module.exports = Items;












