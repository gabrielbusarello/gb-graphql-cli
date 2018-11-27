#!/usr/bin/env node
'use strict';

const { spawn } = require('child_process');
const colors = require('colors/safe');

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
    const runGulp = spawn('npm', ['run', 'gulp'], { shell: true, stdio: 'inherit' });
    const initDev = setTimeout(() => {
        const runDev = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'inherit' });
    }, 20000);
}

module['exports'] = { run };