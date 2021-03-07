//This script has all the functions necessary for salereg to work properly.

//Dependencies
const fs        = require('fs'),
    os          = require('os'),
    chalk       = require('chalk'),
    mongoose    = require("mongoose"),
    Sale        = require('../models/sale'),
    Seller      = require('../models/seller');
const { check } = require('yargs');

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/salesreg", { useNewUrlParser: true, useUnifiedTopology: true });

function initialize(s1, s2, s3, s4, s5){

    //This function initializes the database with 5 sellers provided by the user.
    //Initial ranks are from first to last in the order the user put the names in.

    Seller.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Preparing...");
    });

    Sale.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Resetting sales...");
    });

    var sellerData = [
        {
            name: s1,
            salesTotal: 0,
            rank: 1
        },
        {
            name: s2,
            salesTotal: 0,
            rank: 2
        },
        {
            name: s3,
            salesTotal: 0,
            rank: 3
        },
        {
            name: s4,
            salesTotal: 0,
            rank: 4
        },
        {
            name: s5,
            salesTotal: 0,
            rank: 5
        }
    ]

    sellerData.forEach(function(seed){
        Seller.create(seed, function(err, Seller){
            if(err){
                console.log(err)
            } else {
                console.log('Initialized seller...')
            }
        });
    });
}

function rank(){
    //This function displays the seller ranking in this order:
    //Seller's rank - Seller's name - Seller's total sales.

    //Do not remove this first find!!
    Seller.find({}, function(err, seller){
        for (let i = 1; i < 6; i++) {
            Seller.find({rank: i}, function(err, allSellers){
                allSellers.forEach(seller => {
                    console.log(chalk.bold(seller.rank), "-",
                    `${chalk.blueBright.bold(seller.name)}, Total sales:`,
                    `- ${chalk.bold(chalk.white("US$"+seller.salesTotal))}`)
                })
            })   
        }
    })

}

function updateRanks(){

    //This function updates the seller ranking by:
    // 1: Putting the seller's name and total sales into a temp object
    // 2: Pushing the key-value pairs into a array
    // 3: Sort this array by value
    // 4: Assign the sorted list to the ranks object
    // 5: Update the sellers with their correct rank
    // 6: Done!

    let ranks = {}
    let temp = {}
    var sorted = [];

    Seller.find({}, function(e, allSellers){
        allSellers.forEach(seller => {
            temp[seller.name] = seller.salesTotal
        })
        for (var seller in temp) {
            sorted.push([seller, temp[seller]]);
        }
    
        sorted.sort(function(a, b) {
            return a[1] - b[1];
        });

        ranks[sorted[0][0]] = 5
        ranks[sorted[1][0]] = 4
        ranks[sorted[2][0]] = 3
        ranks[sorted[3][0]] = 2
        ranks[sorted[4][0]] = 1

        for(var seller in ranks){
                Seller.findOneAndUpdate({name: seller}, {rank: ranks[seller]}, function(e, result){
                    if(e){
                        console.log(e)
                    } else{
                        
                    }
                })
        }

    })
}

function list(){
        Seller.find({}, function(err, seller){
            if(err){
                console.log(err)
            } else if(seller[0] == undefined){
                //DATABASE INITIALIZATION CHECK
                //Checks if there are sellers registered in the database.
                //If there are none, return false, warn the user and do nothing.
                console.log(chalk.red('Database not initialized. Please initialize the database with "salereg initialize" and the name of the sellers to be registered.'))
                return false;
            } else{
                updateRanks()
                //The for loop is for ranking the list from highest total of sales to lowest, 
                //finding each seller and listing the sales based on the seller's rank.
                //e.g. If the seller is in fourth place, his sales will appear right
                //after the sales of the third place end.
                for (let i = 1; i < 6; i++) {
                    Seller.find({rank: i}, function(err, allSellers){
                        allSellers.forEach(seller => {
                            Sale.find({sellerName: seller.name}, function(err, sales){
                                sales.forEach(sale => {
                                    console.log(chalk.bold(sale.dateSale), "-",
                                            `${chalk.blueBright.bold(seller.name)}, Customer:`,
                                            `${sale.customerName}, Product:`,
                                            `${chalk.cyan(sale.saleItemName)}, US$${sale.saleValue}`,
                                            `- ${chalk.bold(chalk.white(sale.code))}`)
                                })
                            })
                        })
                    })
                }
            }
        });
    }

//Just a function to get a random integer in-between two numbers.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  

//todo: check for names

function addSale(date, seller, customer, product, price){
    Seller.find({name: seller}, function(err, name){
        if(err){
            console.log(err)
        } else if(name[0] == undefined){
            //This else if statement checks if there is a seller registered with the name of the attempted sale.
            console.log(chalk.red(chalk.bold("There is no seller registered with this name. Aborting.")))
        } else{

            //If there is, add the sale to the database,
            //sum the value of the sale to the seller's total sales and update the ranks.

            //Generate a unique code between 10000 and 49999 (max is exclusive)
            //It starts at 10000 because all numbers having 5 digits is more uniform
            uniqueCode = getRandomInt(10000, 50000)
            Sale.find({code: uniqueCode}, function(err, sale){
                if(err){
                    console.log(err)
                }else if(sale[0] == undefined){
                    //Create a sale with the given parameters
                    Sale.create({code: uniqueCode,
                        sellerName: seller,
                        customerName: customer,
                        dateSale: date,
                        saleItemName: product,
                        saleValue: price}, function(err, sale){
                    if(err){
                        console.log(err)
                    } else{
                        console.log("Sale created successfully!")
                        Seller.find({name: seller}, function(err, seller){
                            if(err){
                                console.log(err)
                            } else{
                            //This section sums the price of the sale to the
                            //salesTotal parameter of the desired seller.
                            let totalSales = seller[0].salesTotal
                            let newSalesTotal = totalSales + price
                            Seller.findOneAndUpdate({name: seller[0].name}, {salesTotal: newSalesTotal}, function(err, result){
                                if(err){
                                    console.log(err)
                                } else{
                                    console.log("Database updated.")

                                    //Update the ranks and return the list with the added sale (already ranked).
                                    updateRanks()
                                    list()
                                }
                            })
                        }
                        })
                        }
                    })
                } else if(sale[0].code == uniqueCode){
                    //If a sale with the same unique code generated is found,
                    //generate another code and try to run the function again with the new one.
                    uniqueCode = getRandomInt(10000, 50000)
                    addSale(date, seller, customer, product, price)
                }
            })
        }
    })
}

function editSale(code, operation, parameter){
    Sale.find({code: code}, function(err, sale){
        if(err){
            console.log(err)
        } else{
            switch (operation) {
                case 'sellername':
                    //Try to find a sale with the given code.
                    Sale.find({code: code}, function(err, sale){
                        if(err){
                            console.log(err)
                        } else if(sale[0] == undefined){
                            console.log(chalk.red('There is no sale with this ID code. Aborting.'))
                        } else{
                            Seller.find({name: sale[0].sellerName}, function(err, seller){
                                if(err){
                                    console.log(err)
                                } else{
                                    //This code block transfers the value of the sale from
                                    //the original seller to the seller in the given parameter.
                                    let totalSales = seller[0].salesTotal
                                    let newTotal = totalSales - sale[0].saleValue
                                    Seller.findOneAndUpdate({name: sale[0].sellerName}, {salesTotal: newTotal}, function(err, result){
                                        if(err){
                                            console.log(err)
                                        } else{
                                            Seller.find({name: parameter}, function(err, seller){
                                                //Find a seller with the same name as the parameter
                                                //If there is none, warn the user and do nothing
                                                
                                                //PS. I think by now you know the drill.
                                                if(err){
                                                    console.log(err)
                                                } else if(seller[0] == undefined){
                                                    console.log(chalk.red('There is no seller registered with this name. Aborting.'))
                                                } else{
                                                    let totalSales = seller[0].salesTotal
                                                    let newSalesTotal = totalSales + sale[0].saleValue
                                                    Seller.findOneAndUpdate({name: parameter}, {salesTotal: newSalesTotal}, function(err, result){
                                                        if(err){
                                                            console.log(err)
                                                        } else{
                                                            Sale.findOneAndUpdate({code: code}, {sellerName: parameter}, function(err, result){
                                                                if(err){
                                                                    console.log(err)
                                                                } else{
                                                                    console.log('Seller name edited on sale ' + code)
                                                                    updateRanks()
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                })
                break;
            
                case 'customername':
                    Sale.findOneAndUpdate({code: code}, {customerName: parameter}, function(err, result){
                        if(err){
                            console.log(err)
                        } else{
                            console.log('Customer name edited on sale ' + code)
                        }
                    })
                break;

                case 'date':
                    Sale.findOneAndUpdate({code: code}, {dateSale: parameter}, function(err, result){
                        if(err){
                            console.log(err)
                        } else{
                            console.log('Date edited on sale ' + code)
                        }
                    })
                break;

                case 'product':
                    Sale.findOneAndUpdate({code: code}, {saleItemName: parameter}, function(err, result){
                        if(err){
                            console.log(err)
                        } else{
                            console.log('Product name edited on sale ' + code)
                        }
                    })
                break;

                case 'price':
                    Sale.find({code: code}, function(err, sale){
                        if(err){
                            console.log(err)
                        }

                        //This code block subtracts or sums the difference between the original price and the desired price.
                        Seller.find({name: sale[0].sellerName}, function(err, seller){
                            let totalSales = seller[0].salesTotal
                            let newSalesTotal = totalSales - sale[0].saleValue
                            Seller.findOneAndUpdate({name: sale[0].sellerName}, {salesTotal: newSalesTotal}, function(err, result){
                                if(err){
                                    console.log(err)
                                } else{
                                    if(parameter > sale[0].saleValue){
                                        difference = parameter - sale[0].saleValue
                                        updatedTotal = totalSales + difference
                                    } else{
                                        difference = sale[0].saleValue - parameter
                                        updatedTotal = totalSales - difference
                                    }
                                    Seller.findOneAndUpdate({name: sale[0].sellerName}, {salesTotal: updatedTotal}, function(err, result){
                                        Sale.findOneAndUpdate({code: code}, {saleValue: parameter}, function(err, result){
                                            if(err){
                                                console.log(err)
                                            } else{
                                                console.log('Product price edited on sale ' + code)
                                                updateRanks()
                                            }
                                        })
                                    })
                                }
                            })
                        })
                    })
                    
                break;

                default:
                    console.log('Operation unknown or none specified.')
                    break;
            }
        }
    })
}

function deleteSale(code){
    Sale.find({code: code}, function(err, sale){
        if(err){
            console.log(err)
        } else if(sale[0] == undefined){
            //Check if there is a sale with the given code. If there isn't, warn the user and do nothing.
            console.log(chalk.red(chalk.bold("There is no sale with this code. Aborting.")))
        } else{
            //If there is, delete the sale.
            Seller.find({name: sale[0].sellerName}, function(err, seller){
                let totalSales = seller[0].salesTotal
                let newSalesTotal = totalSales - sale[0].saleValue
                Seller.findOneAndUpdate({name: sale[0].sellerName}, {salesTotal: newSalesTotal}, function(err, result){
                    if(err){
                        console.log(err)
                    } else{
                        Sale.deleteOne({code: code}, function(err, result){
                            if(err){
                                console.log(err)
                            } else{
                                console.log(chalk.green(chalk.bold("Sale deleted successfully!")))
                                updateRanks()
                            }
                        }) 
                    }
                })
            })
        }
    })
}

exports.list = list;
exports.addSale = addSale;
exports.editSale = editSale;
exports.deleteSale = deleteSale;
exports.initialize = initialize;
exports.rank = rank;