#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('./package.json');
var init = require('./lib/init');

program.version( pkg.version, '-v, --version' );

program
    .command('init <projname>')
        .description('Init the GraphQL project')
        .action(projname => new init(projname));

program.parse( process.argv );
