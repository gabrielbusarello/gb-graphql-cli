#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { exec, spawn } = require('child_process');
const colors = require('colors/safe');
var createFile = require('./createFiles');

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

function create(schema, name) {
    switch(schema) {
        case 'model':
            createModel(name);
        break;
        case 'resource':
            createResource(name);
        break;
        case 'resolver':
            createResolver(name);
        break;
        case 'schema':
            createSchema(name);
        break;
        default:
            console.log(colors.error('The schema not exists.'));
            console.log(colors.help('Possible schemas: (model, resource, resolver, schema)'));
    }
}

create.prototype.creatingFiles = new createFile();

function createModel(name) {
    if (!name.match(/\d/)) {
        fs.stat('src', (err, status) => {
            if (!err) {
                name = formatName(name);
                fs.stat(`src/models/${name}Model.ts`, (err, status) => {
                    if (err) {
                        create.prototype.creatingFiles.createModel(name);
                    }
                });
                const interval = setTimeout(() => {
                    fs.stat(`src/models/${name}Model.ts`, (err, status) => {
                        if (!err) {
                            fs.readFile('./src/interfaces/ModelsInterface.ts', 'utf-8', (err, data) => {
                                if (!data.match(`${name}Model`)) {
                                    data = data.replace(/(\nexport interface ModelsInterface {\n\n *[\w: ;]*)/, `import { ${name}Model } from '../models/${name}Model';\n$1`);
                                    data = data.replace(/(\n})/, `    ${name}: ${name}Model;\n$1`);
                                    fs.writeFile(`./src/interfaces/ModelsInterface.ts`, data, (err) => {
                                        if (!err) {
                                            console.log(colors.info(`${name}Model.ts created!`));
                                            console.log(colors.warn(`ModelsInterface.ts altered!`));
                                        } else {
                                            console.log(colors.error(err));
                                        }
                                    });
                                } else {
                                    console.log(colors.error('Already exists a Model with that name in ModelsInterface.'));
                                }
                            });
                        } else {
                            console.log(colors.error(`An error has occurred while trying create the ${name}Model.ts, please verify the message below...`));
                            console.log(colors.error(err));
                        }
                    });
                }, 1000);
            } else {
                console.log(colors.error('"src" folder not found!'))
                console.log(colors.info('Make sure of you are in the project main folder.'));
            }
        });
    } else {
        console.log(colors.error('The name of Model cannot contain numbers.'));
    }
}

function createResource(name) {
    console.log('Creates a resource named: ' + name);
}

function createResolver(name) {
    console.log('Creates a resolver named: ' + name);
}

function createSchema(name) {
    console.log('Creates a schema named: ' + name);
}

function formatName(name) {
    const nameS = name.split('-');
    name = '';
    nameS.forEach(element => {
        element = element.replace(element[0], function(x) {
            return x.toUpperCase();
        });
        name += element;
    });
    return name;
}

module['exports'] = { run, create };