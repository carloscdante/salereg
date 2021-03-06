var mongoose = require("mongoose");
var Seller  = require("../models/seller.js");
var Sale    = require("../models/sale.js");

mongoose.connect("mongodb://localhost/salesreg", { useNewUrlParser: true, useUnifiedTopology: true });

var sellerData = [
    {
        name: "John Smith",
        salesTotal: 8904.96,
        rank: 0
    },
    {
        name: "Mike Willis",
        salesTotal: 6530.99,
        rank: 0
    },
    {
        name: "Max Payne",
        salesTotal: 10804.78,
        rank: 0
    },
    {
        name: "Casey Luong",
        salesTotal: 4000,
        rank: 0
    },
    {
        name: "Jeremy Zucker",
        salesTotal: 7893.99,
        rank: 0
    }
]

var saleData = [
    {
        sellerName: "Max Payne",
        customerName: "Jeremiah Levy",
        dateSale: "27/02/2021",
        saleItemName: "Headphones",
        saleValue: 899.99,
        code: 20204
    },
    {
        sellerName: "Casey Luong",
        customerName: "Karen Ludwig",
        dateSale: "14/01/2021",
        saleItemName: "Mechanical Keyboard",
        saleValue: 399.99,
        code: 36045
    }

]

function seedDB(){
   //Remove all Sellers
   Seller.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Sellers from database!");
    });

    Sale.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Sales from database!");
    });

    saleData.forEach(function(seed){
            try {
                Sale.create(seed, function(err, Sale){
                    console.log('added a sale')
                })
            } catch (e) {
                console.log(e)
            }
        })

         //add a few sellers
    sellerData.forEach(function(seed){
            Seller.create(seed, function(err, Seller){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a Seller");
                }
            });
        });
    }; 

    seedDB();

module.exports = seedDB;