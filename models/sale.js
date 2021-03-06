var mongoose = require("mongoose");

var saleSchema = new mongoose.Schema({
   code: Number,
   sellerName: String,
   customerName: String,
   dateSale: String,
   saleItemName: String,
   saleValue: Number
});

module.exports = mongoose.model("Sale", saleSchema);