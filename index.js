#!/usr/bin/env node
const yargs     = require('yargs');
let utils       = require('./lib/utils'),
    package     = require('./package.json'),
    mongoose    = require("mongoose"),
    Sale        = require('./models/sale'),
    Seller      = require('./models/seller')

mongoose.connect("mongodb://localhost/salesreg", { useNewUrlParser: true, useUnifiedTopology: true });

const argv = yargs
    .command('list', 'List all sales, ranked by seller with highest to lowest amount sold.', {})
    .command('add', 'Adds a sale to the database.', {
        date: {
            description: 'Date of the given sale.',
            alias: 'd',
            type: 'string',
        },
        seller: {
            description: "Name of the seller.",
            alias: 's',
            type: 'string',
        },
        customer: {
            description: 'Name of the customer.',
            alias: 'c',
            type: 'string',
        },
        item: {
            description: 'Name of the item sold.',
            alias: 'i',
            type: 'string',
        },
        price: {
            description: 'Price of the item sold.',
            alias: 'p',
            type: 'number',
        }
    })
    .command('edit', 'Edits a parameter from a sale.', {
        code: {
            description: 'Unique ID of the targeted sale (last entry on the list).',
            alias: 'id',
            type: 'number',
        },
        parameter: {
            description: 'Parameter to be changed (e.g. sellername)',
            alias: 'p',
            type: 'string',
        },
        value: {
            description: 'Desired value of the parameter to be changed.',
            alias: 'v',
            type: 'string',
        }
    })
    .command('delete', 'Deletes a given sale.', {
        code: {
            description: 'Unique ID of the targeted sale (last entry on the list).',
            alias: 'id',
            type: 'number',
        }
    })
    .command('$0', 'Salereg - Sale registrator', () => {}, (argv) => {
        yargs.showHelp()
    })
    .option('version', {
        alias: 'v',
        description: 'Show the version'
    })
    .help()
    .alias('help', 'h')
    .argv;

    if(argv.version){
        let version = package.version
    }

    if (argv._.includes('list')) {
        utils.list()
    }

    if (argv._.includes('add')) {
        const date = argv.date;
        const seller = argv.seller;
        const customer = argv.customer;
        const item = argv.item;
        const price = argv.price;

        utils.addSale(date, seller, customer, item, price)
    }

    if (argv._.includes('edit')) {
        const code = argv.code;
        const parameter = argv.parameter;
        const value = argv.value;

        utils.editSale(code, parameter, value)
    }

    if (argv._.includes('delete')) {
        const code = argv.code;

        utils.deleteSale(code)
    }