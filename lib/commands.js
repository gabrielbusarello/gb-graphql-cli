#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { exec, spawn } = require('child_process');
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
    exec('type package.json', (err, stdout, stderr) => {
        if (!stderr) {
            fs.readFile('package.json', (err, data) => {
                if (!err) {
                    const teste = JSON.parse(data);
                    if (teste.scripts.gulp) {
                        if (teste.scripts.dev) {
                            const runGulp = spawn('npm', ['run', 'gulp'], { shell: true, stdio: 'inherit' });
                            const initDev = setTimeout(() => {
                                const runDev = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'inherit' });
                            }, 20000);
                        } else {
                            console.log(colors.warn('The "dev" script don\'t exists in package.json! Make sure that you are in your project.'));
                        }
                    } else {
                        console.log(colors.warn('The "gulp" script don\'t exists in package.json! Make sure that you are in your project.'));
                    }
                }
            });
        } else {
            console.log(colors.error('Package.json not found! Make sure that you are in your project.'));
        }
    });
}

module['exports'] = { run };