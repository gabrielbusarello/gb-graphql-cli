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
    fs.stat('package.json', (err, status) => {
        if (!err) {
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
                            console.log(colors.info(`${name}Model.ts created!`));
                            fs.readFile('./src/interfaces/ModelsInterface.ts', 'utf-8', (err, data) => {
                                if (!data.match(`${name}Model`)) {
                                    data = data.replace(/(\nexport interface ModelsInterface {\n\n *[\w: ;]*)/, `import { ${name}Model } from '../models/${name}Model';\n$1`);
                                    data = data.replace(/(\n})/, `    ${name}: ${name}Model;\n$1`);
                                    fs.writeFile(`./src/interfaces/ModelsInterface.ts`, data, (err) => {
                                        if (!err) {
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
    if (!name.match(/\d/)) {
        fs.stat('src', (err, status) => {
            if (!err) {
                name = formatName(name, true);
                fs.stat(`src/graphql/resources/${name}`, (err, status) => {
                    if (err) {
                        fs.mkdir(`src/graphql/resources/${name}`, (err, status) => {
                            if (!err) {
                                create.prototype.creatingFiles.createResolvers(name);
                                create.prototype.creatingFiles.createSchema(name);
                            }
                        });
                    } else {
                        console.log(colors.error('Already exists a Resource with that name.'));
                    }
                });
                const interval = setTimeout(() => {
                    fs.stat(`src/graphql/resources/${name}`, (err, status) => {
                        if (!err) {
                            console.log(colors.info(`Resolver ${name} created!`));
                            fs.readFile('./src/graphql/mutation.ts', 'utf-8', (err, data) => {
                                if (!data.match(`${name}Mutations`)) {
                                    data = data.replace(/(\nconst Mutation)/, `import { ${name}Mutations } from './resources/${name}/${name}.schema';\n$1`);
                                    data = data.replace(/(    }\n`)/, `        \${ ${name}Mutations }\n$1`);
                                    fs.writeFile(`./src/graphql/mutation.ts`, data, (err) => {
                                        if (!err) {
                                            console.log(colors.warn(`Mutation.ts altered!`));
                                        } else {
                                            console.log(colors.error(err));
                                        }
                                    });
                                } else {
                                    console.log(colors.error('Already exists a Mutation with that name in mutation.'));
                                }
                            });
                            fs.readFile('./src/graphql/query.ts', 'utf-8', (err, data) => {
                                if (!data.match(`${name}Queries`)) {
                                    data = data.replace(/(\nconst Query)/, `import { ${name}Queries } from './resources/${name}/${name}.schema';\n$1`);
                                    data = data.replace(/(    }\n`)/, `        \${ ${name}Queries }\n$1`);
                                    fs.writeFile(`./src/graphql/query.ts`, data, (err) => {
                                        if (!err) {
                                            console.log(colors.warn(`Query.ts altered!`));
                                        } else {
                                            console.log(colors.error(err));
                                        }
                                    });
                                } else {
                                    console.log(colors.error('Already exists a Query with that name in mutation.'));
                                }
                            });
                            fs.readFile('./src/graphql/schema.ts', 'utf-8', (err, data) => {
                                if (!data.match(`${name}Types`)) {
                                    data = data.replace(/([// \w.]*\nconst resolvers = merge)/, `import { ${name}Types } from './resources/${name}/${name}.schema';\nimport { ${name}Resolvers } from './resources/${name}/${name}.resolvers';\n\n$1`);
                                    data = data.replace(/(const resolvers = merge\()/, `$1\n    ${name}Resolvers,`);
                                    data = data.replace(/(],)/, `    ${name}Types,\n    $1`);
                                    fs.writeFile(`./src/graphql/schema.ts`, data, (err) => {
                                        if (!err) {
                                            console.log(colors.warn(`Schema.ts altered!`));
                                        } else {
                                            console.log(colors.error(err));
                                        }
                                    });
                                } else {
                                    console.log(colors.error('Already exists a Type with that name in schema.'));
                                }
                            });
                        } else {
                            console.log(colors.error(`An error has occurred while trying to access the Resource ${name}, please verify the message below...`));
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
        console.log(colors.error('The name of Resource cannot contain numbers.'));
    }
}

function formatName(name, firstSmall = false) {
    const nameS = name.split('-');
    name = '';
    let smallControl = !firstSmall;
    nameS.forEach(element => {
        if (smallControl) {
            element = element.replace(element[0], function(x) {
                return x.toUpperCase();
            });
        }
        name += element;
        smallControl = true;
    });
    return name;
}

function add(type, projName = null) {
    if (type === 'auth') {
        create.prototype.creatingFiles.createAuthExampleInterface(projName);
        create.prototype.creatingFiles.createExtractJwtMiddleware(projName);
        create.prototype.creatingFiles.createAuthResolver(projName);
        create.prototype.creatingFiles.createVerifyTokenResolver(projName);
        exec(`cd ${projName}/src/graphql/resources && mkdir token`, (err, stdout, stderr) => {
            if (!stderr) {
                create.prototype.creatingFiles.createTokenResolver(projName);
                create.prototype.creatingFiles.createTokenSchema(projName);
            } else {
                console.log(colors.error("An error has occurred while trying create the token folders..."));
                console.log(colors.error(stderr));
            }
        });
    }
}

module['exports'] = { run, create, add };