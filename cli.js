#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/init');
var run = require('./lib/run');
var colors = require('colors/safe');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});


program.version( pkg.version, '-v, --version' );

program
    .command('init <projname>')
        // .option('-d, --delay', 'You can set')
        .description('Init the GraphQL project')
        .action(projname => new init(projname));

program
    .command('run')
        .description('Starts the development server')
        .action(() => new run());

program.on('command:*', function () {
    console.log(colors.error(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`));
    process.exit(1);
});

program.on('--help', function(){
    console.log('')
    console.log('Examples:');
    console.log('   gb-graphql-cli init helloWorld');
});

program.parse( process.argv );
