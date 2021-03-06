//This script scans a directory and returns an array "data" with
//all the names of the directories, storing it in a JSON file
//located in /home/.config (which you should have).

//Dependencies
const fs        = require('fs'),
    os          = require('os'),
    chalk       = require('chalk'),
    mongoose    = require("mongoose"),
    Sale        = require('../models/sale'),
    Seller      = require('../models/seller')

mongoose.set('useFindAndModify', false);
//Standard declarations
let sys = os.platform();
mongoose.connect("mongodb://localhost/salesreg", { useNewUrlParser: true, useUnifiedTopology: true });

function updateRanks(){
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
            //console.log(ranks[seller])
                Seller.findOneAndUpdate({name: seller}, {rank: ranks[seller]}, function(e, result){
                    if(e){
                        console.log(e)
                    } else{
                        //console.log(result)
                    }
                })
        }

       //console.log(ranks)
    })
}

function list(){
    updateRanks()
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

    // Sale.find({}, function(err, allSales){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         updateRanks();
    //              allSales.forEach(sale => {
    //                  Seller.find({name: sale.sellerName}, function(err, allSellers){
    //                      allSellers.forEach(seller => {
    //                         console.log(chalk.bold(sale.dateSale), "-",
    //                         `${chalk.blueBright.bold(seller.name)}, Customer:`,
    //                         `${sale.customerName}, Product:`,
    //                         `${chalk.cyan(sale.saleItemName)}, US$${sale.saleValue}`,
    //                         `- ${chalk.bold(chalk.white(sale.code))}`)
    //                      })
    //                  })
    //              })
    //     }
    //  });
}

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
            console.log(chalk.red(chalk.bold("There is no seller registered with this name. Aborting.")))
        } else{
            uniqueCode = getRandomInt(10000, 50000)
            Sale.find({code: uniqueCode}, function(err, sale){
                if(err){
                    console.log(err)
                }else if(sale[0] == undefined){
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
                            let totalSales = seller[0].salesTotal
                            let newSalesTotal = totalSales + price
                            // console.log(seller[0].salesTotal)
                            // console.log(newSalesTotal)
                            Seller.findOneAndUpdate({name: seller[0].name}, {salesTotal: newSalesTotal}, function(err, result){
                                if(err){
                                    console.log(err)
                                } else{
                                    console.log("Database updated.")
                                    updateRanks()
                                    list()
                                }
                            })
                        }
                        })
                        }
                    })
                } else if(sale[0].code == uniqueCode){
                    uniqueCode = getRandomInt(10000, 50000)
                    addSale(date, seller, customer, product, price)
                }
            })
        }
    })
}

//todo fix edit sale

function editSale(code, operation, parameter){
    Sale.find({code: code}, function(err, sale){
        if(err){
            console.log(err)
        } else{
            switch (operation) {
                case 'sellername':
                    Sale.find({code: code}, function(err, sale){
                        Seller.find({name: sale[0].sellerName}, function(err, seller){
                        let totalSales = seller[0].salesTotal
                        let newTotal = totalSales - sale[0].saleValue
                        Seller.findOneAndUpdate({name: sale[0].sellerName}, {salesTotal: newTotal}, function(err, result){
                            if(err){
                                console.log(err)
                            } else{
                                Seller.find({name: parameter}, function(err, seller){
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
                                })
                            }
                        })
                    })
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
            console.log(chalk.red(chalk.bold("There is no sale with this code. Aborting.")))
        } else{
            Sale.deleteOne({code: code}, function(err, result){
                if(err){
                    console.log(err)
                } else{
                    console.log(chalk.green(chalk.bold("Sale deleted successfully!")))
                }
            })
        }
    })
}

//addSale('24/02/2021', 'Jeremy Zucker', 'George Cunningham', 'Xbox Series X', 499.99)

//editSale(46332, 'price', 399.99)

//updateRanks()

//list()

//deleteSale(42472)

exports.list = list;
exports.addSale = addSale;
exports.editSale = editSale;
exports.deleteSale = deleteSale;