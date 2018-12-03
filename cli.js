#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/init');
var { run, create } = require('./lib/commands');
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
        .option('-d, --dialect [type]', 'You can set what dialect, that is, Database Management System (DBMS) the project will use. Possible values: (mysql, mssql, sqlite, postgres). Default: mysql', 'mysql')
        .description('Init the GraphQL project')
        .action((projname, options) => {
            if (options.dialect === 'mysql' || options.dialect === 'mssql' || options.dialect === 'sqlite' || options.dialect === 'postgres') {
                new init(projname, options.dialect);
            } else {
                console.log(colors.error('The seted dialect not exists.'));
                console.log(colors.help('Possible values: (mysql, mssql, sqlite, postgres)'));
            }
        });

program
    .command('run')
        .description('Start the development server')
        .action(() => new run());

program
    .command('create <schema> <name>')
    .description('Create files based on a schematic. Possible schemas: (model, resource, resolver, schema)')
    .action((schema, name) => {
        if (schema === 'model' || schema === 'resource' || schema === 'resolver' || schema === 'schema') {
            new create(schema, name);
        } else {
            console.log(colors.error('The schema not exists.'));
            console.log(colors.help('Possible schemas: (model, resource, resolver, schema)'));
        }
    })

program.on('command:*', function () {
    console.log(colors.error(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`));
    process.exit(1);
});

program.on('--help', function(){
    console.log('')
    console.log('Examples:');
    console.log('   gb-graphql-cli init helloWorld');
    console.log('   gb-graphql-cli init helloWorld -d mssql');
    console.log('   gb-graphql-cli run');
    console.log('   gb-graphql-cli create model example');
});

program.parse( process.argv );
