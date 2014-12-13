var mongodb = require('./db');

function Items(barcode,name,price,unit,category){
    this.barcode = barcode;
    this.name = name;
    this.price = price;
    this.unit = unit;
    this.category = category;
}

module.exports = Items;


Items.prototype.save = function(callback){
    var item = {
        barcode: this.barcode,
        name: this.name,
        price: this.price,
        unit: this.unit,
        category: this.category
    };
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }

        db.collection('items',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insert(item, {
                safe: true
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};

Items.get_items = function(callback){
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
        db.collection('items',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.find().toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            })
        })
    })

}
















