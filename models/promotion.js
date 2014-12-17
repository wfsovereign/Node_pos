var mongodb = require("./db.js");

function Promotion(type, barcode) {
    this.type = type;
    this.barcode = barcode || [];
}

Promotion.prototype.save = function (callback) {
    var promotion = {
        type: this.type,
        barcode: this.barcode
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('promotion', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(promotion, {
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
Promotion.prototype.update_barcode = function(callback) {
    var promotion = {
        type: this.type,
        barcode: this.barcode
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err)
        }

        db.collection('promotion', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            console.log(promotion,"================");
            collection.update({"type": promotion.type}, {"$addToSet": {"barcodes": promotion.barcode}}, {
                safe: true
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                mongodb.close();
                callback(null);
            })
        })
    })
};

/*
mongodb.open(function (err, db) {
    if (err) {
        return callback(err)
    }

    db.collection('promotion', function (err, collection) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        collection.update(({"type": promotion.type}, {"$addToSet": {"barcodes": promotion.barcode}}), {
            safe: true
        }, function (err) {
            if (err) {
                return callback(err);
            }
            mongodb.close();
            callback(null);
        })
    })
})
*/

Promotion.get_all_promotion = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('promotion', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find().toArray(function (err, promo) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, promo);
            })
        })
    })

};

module.exports = Promotion;