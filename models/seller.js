var mongoose = require("mongoose");

var sellerSchema = new mongoose.Schema({
    name: String,
    salesTotal: Number,
    rank: Number
});

module.exports = mongoose.model("Seller", sellerSchema);