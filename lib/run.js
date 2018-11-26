#!/usr/bin/env node
'use strict';

var exec = require('child_process').exec;
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

function run() {
    console.log(colors.silly('Working'));
}

module['exports'] = run;