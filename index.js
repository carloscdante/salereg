#!/usr/bin/env node
const yargs     = require('yargs');
const utils       = require('./lib/utils'),
    package     = require('./package.json'),
    mongoose    = require("mongoose"),
    Sale        = require('./models/sale'),
    Seller      = require('./models/seller')

mongoose.connect("mongodb://localhost/salesreg", { useNewUrlParser: true, useUnifiedTopology: true });

const argv = yargs
    .command('initialize', 'Initializes 5 sellers and store them into the database.', {
        s1: {
            description: 'Full name of the first seller (e.g "John Smith")',
            alias: '1',
            type: 'number',
        },
        s2: {
            description: 'Full name of the second seller (e.g "John Smith")',
            alias: '2',
            type: 'string',
        },
        s3: {
            description: 'Full name of the third seller (e.g "John Smith")',
            alias: '3',
            type: 'string',
        },
        s4: {
            description: 'Full name of the fourth seller (e.g "John Smith")',
            alias: '4',
            type: 'string',
        },
        s5: {
            description: 'Full name of the fifth seller (e.g "John Smith")',
            alias: '5',
            type: 'string',
        }
    })
    .command('list', 'List all sales, ranked by seller with highest to lowest amount sold.', {})
    .command('rank', 'Displays the seller ranking.', {})
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
            alias: 'c',
            type: 'number',
        },
        parameter: {
            description: 'Parameter to be changed (e.g. sellername)',
            alias: 'p',
            type: 'string',
        },
        val: {
            description: 'Desired value of the parameter to be changed.',
            alias: 'v',
            type: 'string',
        }
    })
    .command('delete', 'Deletes a given sale.', {
        code: {
            description: 'Unique ID of the targeted sale (last entry on the list).',
            alias: 'c',
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

    if (argv._.includes('rank')) {
        utils.rank()
    }

    if (argv._.includes('initialize')) {
        const s1 = argv._[2];
        const s2 = argv._[4];
        const s3 = argv._[6];
        const s4 = argv._[8];
        const s5 = argv._[10];

        utils.initialize(s1, s2, s3, s4, s5)
    }

    if (argv._.includes('edit')) {
        const code = argv.code
        const parameter = argv.parameter
        let value = argv._[1]
        utils.editSale(code, parameter, value)
    }

    if (argv._.includes('add')) {
        const date = argv.date;
        const seller = argv.seller;
        const customer = argv.customer;
        const item = argv.item;
        const price = argv.price;

        utils.addSale(date, seller, customer, item, price)
    }

    if (argv._.includes('delete')) {
        const code = argv.code;

        utils.deleteSale(code)
    }