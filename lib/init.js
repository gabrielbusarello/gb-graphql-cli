#!/usr/bin/env node
'use strict';

var exec = require('child_process').exec;
var colors = require('colors/safe');
var createFile = require('./createFiles');
var { add } = require('./commands');

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

function init(projName, dialect, auth) {
    // Verifying if npm, node and nodemon have installed.
    exec('node -v && npm -v && nodemon -v', (err, stdout, stderr) => {
        if (!stderr) {
            console.log(colors.info('Creating GraphQL Project with name: ' + projName));
            // Creating the project directory.
            exec(`mkdir ${projName}`, (err, stdout, stderr) => {
                if (!stderr) {
                    console.log(colors.silly('Directory have been created.'));
                    console.log(colors.info('Creating the configuration files...'));
                    const creatingFiles = new createFile(projName, dialect);
                    creatingFiles.packageJson();
                    creatingFiles.gitIgnore();
                    creatingFiles.gulpFile();
                    creatingFiles.tsConfig();
                    exec(`cd ${projName} && type package.json && type .gitignore && type gulpfile.js && type tsconfig.json`, (err, stdout, stderr) => {
                        if (!stderr) {
                            console.log(colors.silly('Configuration files have been created.'));
                            console.log(colors.info('Installing the dependencies...'));
                            exec(`cd ${projName} && npm install --save-dev @types/bcryptjs @types/chai @types/chai-http @types/compression @types/cors @types/express @types/express-graphql @types/graphql @types/helmet @types/jsonwebtoken @types/lodash @types/mocha @types/node @types/sequelize chai chai-http gulp gulp-clean gulp-typescript mocha nodemon nyc ts-node typescript`, (err, stdout, stderr) => {
                                if (stdout) {
                                    console.log(stdout);
                                    console.log(stderr);

                                    exec(`cd ${projName} && npm install --save bcryptjs compression cors dataloader express express-graphql graphql graphql-fields graphql-tools helmet jsonwebtoken lodash mysql2 sequelize ${dialect === 'mssql' ? 'tedious' : ''}`, (err, stdout, stderr) => {
                                        if (stdout) {
                                            console.log(stdout);
                                            console.log(stderr);

                                            console.log(colors.silly('Dependencies have been installed.'));
                                            console.log(colors.info('Creating the project directories...'));
                                            exec(`cd ${projName} && mkdir src && cd src && mkdir config && mkdir graphql && mkdir interfaces && mkdir middlewares && mkdir models && mkdir utils && cd graphql && mkdir ast && mkdir composable && mkdir dataloaders && mkdir resources && cd resources && mkdir example`, (err, stdout, stderr) => {
                                                if (!stderr) {
                                                    console.log(colors.silly('The project\'s directories have been created.'));
                                                    console.log(colors.info('Creating the first files...'));
                                                    creatingFiles.index();
                                                    creatingFiles.clusters();
                                                    creatingFiles.app();
                                                    creatingFiles.config();
                                                    creatingFiles.utils();
                                                    exec(`cd ${projName}/src && type index.ts && type clusters.ts && type app.ts && cd config && type config.json && cd ../utils && type utils.ts`, (err, stdout, stderr) => {
                                                        if (!stderr) {
                                                            console.log(colors.silly('First files have been created.'));
                                                            console.log(colors.info('Creating the files of graphql folder...'));
                                                            creatingFiles.mutation();
                                                            creatingFiles.query(auth);
                                                            creatingFiles.schema(auth);
                                                            exec(`cd ${projName}/src/graphql && type mutation.ts && type query.ts && type schema.ts`, (err, stdout, stderr) => {
                                                                if (!stderr) {
                                                                    console.log(colors.silly('Files of graphql\'s folder have been created.'));
                                                                    console.log(colors.info('Creating the files of ast, composable, dataloaders and resources folders...'));
                                                                    creatingFiles.requestedFields();
                                                                    creatingFiles.composableResolver();
                                                                    creatingFiles.dataLoaderFactory();
                                                                    creatingFiles.exampleLoader();
                                                                    creatingFiles.exampleResolvers();
                                                                    creatingFiles.exampleSchema();

                                                                    exec(`cd ${projName}/src/graphql && cd ast && type RequestedFields.ts && cd ../composable && type composable.resolver.ts && cd ../dataloaders && type DataLoaderFactory.ts && type exampleLoader.ts && cd ../resources/example && type example.resolvers.ts && type example.schema.ts`, (err, stdout, stderr) => {
                                                                        if (!stderr) {
                                                                            console.log(colors.silly('Files of ast, composable, dataloaders and resources folders have been created.'));
                                                                            console.log(colors.info('Creating the files of interfaces folder...'));
                                                                            creatingFiles.baseModelInterface();
                                                                            creatingFiles.dataLoaderParamInterface();
                                                                            creatingFiles.dataLoadersInterface();
                                                                            creatingFiles.dbConnectionInterface();
                                                                            creatingFiles.modelsInterface();
                                                                            creatingFiles.resolverContextInterface(auth);

                                                                            exec(`cd ${projName}/src/interfaces && type BaseModelInterface.ts && type DataLoaderParamInterface.ts && type DataLoadersInterface.ts && type DbConnectionInterface.ts && type ModelsInterface.ts && type ResolverContextInterface.ts`, (err, stdout, stderr) => {
                                                                                if (!stderr) {
                                                                                    console.log(colors.silly('Files of interfaces folder have been created.'));
                                                                                    console.log(colors.info('Creating the files of models folder...'));
                                                                                    creatingFiles.modelIndex();
                                                                                    creatingFiles.exampleModel();
                                                                                    if (auth) {
                                                                                        new add('auth', projName);
                                                                                    }

                                                                                    exec(`cd ${projName}/src/models && type index.ts && type ExampleModel.ts`, (err, stdout, stderr) => {
                                                                                        if (!stderr) {
                                                                                            console.log(colors.silly('Files of models folder have been created.'));
                                                                                            console.log(colors.verbose('CONGRATULATIONS, the project has been created completely...'));
                                                                                            console.log(colors.warn('The Graphql\'s cli, has created by: Gabriel Dezan Busarello! Thank you!'));
                                                                                        } else {
                                                                                            console.log(colors.error("An error has occurred while trying create the files of models folder, please verify the message below..."));
                                                                                            console.log(colors.error(stderr));        
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    console.log(colors.error("An error has occurred while trying create the files of interfaces folder, please verify the message below..."));
                                                                                    console.log(colors.error(stderr));        
                                                                                }
                                                                            });
                                                                        } else {
                                                                            console.log(colors.error("An error has occurred while trying create the files of ast, composable and dataloaders folders, please verify the message below..."));
                                                                            console.log(colors.error(stderr));
                                                                        }
                                                                    });
                                                                } else {
                                                                    console.log(colors.error("An error has occurred while trying create the index.ts and config.json file, please verify the message below..."));
                                                                    console.log(colors.error(stderr));
                                                                }
                                                            });
                                                        } else {
                                                            console.log(colors.error("An error has occurred while trying create the first files, please verify the message below..."));
                                                            console.log(colors.error(stderr));
                                                        }
                                                    });
                                                } else {
                                                    console.log(colors.error("An error has occurred while trying create the project's directories, please verify the message below..."));
                                                    console.log(colors.error(stderr));
                                                }
                                            });
                                        } else {
                                            colors.error("An error has occurred while trying install the prod dependencies, please try again...")
                                        }
                                    });
                                } else {
                                    colors.error("An error has occurred while trying install the dev dependencies, please try again...")
                                }
                            });
                        } else {
                            console.log(colors.error("An error has occurred while trying create the configuration files, please verify the message below..."));
                            console.log(colors.error(stderr));
                        }
                    });
                } else {
                    console.log(colors.warn("An error has occurred, please verify the message below..."));
                    console.log(colors.error(stderr));
                }
            });
        } else {
            console.log(colors.error(stderr));
            console.log(colors.warn("Please, install globally the missing packages for continue..."));
        }
    });
}

module['exports'] = init;