#!/usr/bin/env node
const yargs     = require('yargs');
let utils       = require('./lib/utils')
let paste       = require('./lib/paste')
let package     = require('./package.json'),
    mongoose    = require("mongoose"),
    Sale        = require('./models/sale'),
    Seller      = require('./models/seller'),
    seedDB      = require("./lib/seeds")

mongoose.connect("mongodb://localhost/salesreg", { useNewUrlParser: true, useUnifiedTopology: true });
seedDB();

// const argv = yargs
//     .command('yank', 'Yanks a folder structure from a given folder.', {
//         folder: {
//             description: 'The master folder of the structure to be yanked.',
//             alias: 'f',
//             type: 'string',
//         },
//         name: {
//             description: 'Name of the yank to be registered in the Yankfile.',
//             alias: 'n',
//             type: 'string',
//         }
//     })
//     .command('paste', 'Yanks a folder structure from a given folder.', {
//         folder: {
//             description: 'The master folder to create all directories in.',
//             alias: 'f',
//             type: 'string',
//         },
//         name: {
//             description: 'Name of the yank to be activated.',
//             alias: 'n',
//             type: 'string',
//         }
//     })
//     .command('unyank', 'Deletes a yank from the Yankfile.', {
//         name: {
//             description: 'Name of the yank to be deleted from the Yankfile.',
//             alias: 'n',
//             type: 'string',
//         }
//     })
//     .command('list', 'List all yanks.', {})
//     .command('gityank', 'Yanks a folder structure from a Git repository.', {
//         url: {
//             description: 'The repository URL.',
//             alias: 'u',
//             type: 'string',
//         },
//         name: {
//             description: 'Name of the yank to be registered in the Yankfile.',
//             alias: 'n',
//             type: 'string',
//         }
//     })
//     .command('$0', 'Yankit - Folder Structure Macro Utility', () => {}, (argv) => {
//         yargs.showHelp()
//     })
//     .option('version', {
//         alias: 'v',
//         description: 'Show the version'
//     })
//     .help()
//     .alias('help', 'h')
//     .argv;

//     if(argv.version){
//         let version = package.version
//         //console.log('Yankit v' + version)
//     }

//     if (argv._.includes('yank')) {
//         const folder = argv.folder;
//         const name = argv.name;

//         yankit.yank(folder, name)
//     }

//     if (argv._.includes('paste')) {
//         const folder = argv.folder;
//         const name = argv.name;

//         paste.populate(name, folder)
//     }

//     if (argv._.includes('list')) {
//         yankit.list()
//     }

//     if (argv._.includes('unyank')) {
//         const name = argv.name;

//         yankit.unyank(name)
//     }

//     if (argv._.includes('gityank')) {
//         const url = argv.url;
//         const name = argv.name;

//         yankit.yankGitRepo(url, name)
//     }