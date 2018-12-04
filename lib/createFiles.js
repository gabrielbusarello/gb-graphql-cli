var fs = require('fs');

var __projName = '';
var __dialect = 'mysql';
var packageJson = '';

function createFile(projName = '', dialect = '') {
    __projName = projName;
    __dialect = dialect;
}

/*  ---------- Initial Files ----------  */

/**
 * Pasta ${projName}
 * packageJson
 */
createFile.prototype.packageJson = () => {
    packageJson = `{
    "name": "${__projName}",
    "version": "0.0.1",
    "main": "index.js",
    "scripts": {
        "clusters": "NODE_ENV=production port=8080 node dist/clusters",
        "build": "npm run gulp build",
        "start": "npm run build && npm run clusters",
        "dev": "set NODE_ENV=development & set JWT_SECRET=gb-graphql-cli & nodemon --delay 5 dist/index",
        "gulp": "node_modules/.bin/gulp",
        "test": "set NODE_ENV=test & set JWT_SECRET=jwt_test & mocha",
        "pipelines": "set NODE_ENV=pipelines & set JWT_SECRET=jwt_pipelines & mocha",
        "coverage": "nyc --extension .ts --include src/**/*.ts --reporter html npm test"
    },
    "license": "MIT"
}
`;

    fs.writeFile(`./${__projName}/package.json`, packageJson, (err) => {if (err) throw err;});
}

/**
 * Pasta ${projName}
 * gitIgnore
 */
createFile.prototype.gitIgnore = () => {
    const gitIgnore = `.nyc_output/
coverage/
dist/
node_modules/
`;

    fs.writeFile(`./${__projName}/.gitignore`, gitIgnore, (err) => {if (err) throw err;});
}

/**
 * Pasta ${projName}
 * gulpFile
 */
createFile.prototype.gulpFile = () => {
    const gulpFile = `const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', ['static'], () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('dist')); 
});

gulp.task('static', ['clean'], () => {
    return gulp.src(['src/**/*.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('build', ['scripts']);

gulp.task('watch', ['build'], () => {
    return gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['build']);
});

gulp.task('default', ['watch']);
`;

    fs.writeFile(`./${__projName}/gulpfile.js`, gulpFile, (err) => {if (err) throw err;});
}

/**
 * Pasta ${projName}
 * tsConfig
 */
createFile.prototype.tsConfig = () => {
    const tsConfig = `{
    "compilerOptions": {
        "lib": [
            "esnext",
            "dom",
            "es2017"
        ],
        "target": "es2017",
        "module": "commonjs"
    },
    "compileOnSave": false,
    "include": [
        "src/**/*.ts"
    ],
    "exclude": [
        "node_modules"
    ]
}
`;

    fs.writeFile(`./${__projName}/tsconfig.json`, tsConfig, (err) => {if (err) throw err;});
}

/**
 * Pasta src
 * index
 */
createFile.prototype.index = () => {
    const index = `import * as http from 'http';
import App from './app';
import db from './models';
import { normalizePort, onError, onListening } from './utils/utils';

const server = http.createServer(App);
const port = normalizePort(process.env.port || 3000);
const host = process.env.host || '127.0.0.1';

db.sequelize.sync()
    .then(() => {
        server.listen(port, host);
        server.on('error', onError(server));
        server.on('listening', () => onListening(server));
    });
`;

    fs.writeFile(`./${__projName}/src/index.ts`, index, (err) => {if (err) throw err;});
}

/**
 * Pasta src
 * clusters
 */
createFile.prototype.clusters = () => {
    const clusters = `import * as cluster from 'cluster';
import { CpuInfo, cpus } from 'os';

class Clusters {
    private cpus: CpuInfo[];

    constructor() {
        this.cpus = cpus();
        this.init();
    }

    public init(): void {
        if (cluster.isMaster) {
            this.cpus.forEach(() => cluster.fork());

            cluster.on('listening', (worker: cluster.Worker) => {
                console.log('Cluster %d connected', worker.process.pid);
            });
            cluster.on('disconnect', (worker: cluster.Worker) => {
                console.log('Cluster %d disconnected', worker.process.pid);
            });
            cluster.on('exit', (worker: cluster.Worker) => {
                console.log('Cluster %d exited', worker.process.pid);
                cluster.fork();
            });
        } else {
            require('./index');
        }
    }
}

export default new Clusters();
`;

    fs.writeFile(`./${__projName}/src/clusters.ts`, clusters, (err) => {if (err) throw err;});
}

/**
 * Pasta src
 * app
 */
createFile.prototype.app = () => {
    const app = `import * as express from 'express';
import * as graphqlHttp from 'express-graphql'
import * as cors from 'cors';
import * as compression from 'compression';
import * as helmet from 'helmet';

import schema from './graphql/schema'

import db from './models'
import { DataLoaderFactory } from './graphql/dataloaders/DataLoaderFactory';
import { RequestedFields } from './graphql/ast/RequestedFields';

class App {
    public express: express.Application;
    private dataLoaderFactory: DataLoaderFactory;
    private requestedFields: RequestedFields;

    constructor() {
        this.express = express();
        this.init();
    }

    private init(): void {
        this.requestedFields = new RequestedFields();
        this.dataLoaderFactory = new DataLoaderFactory(db, this.requestedFields);
        this.middleware();
    }

    private middleware(): void {
        this.express.use(cors({
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        }));
        this.express.use(compression());
        this.express.use(helmet());

        this.express.use('/graphql',
            // We can add anothers middlewares here!
            (req, res, next) => {
                req['context'] = {
                    db: db,
                    dataloaders: this.dataLoaderFactory.getLoaders(),
                    requestedFields: this.requestedFields
                }
                next();
            },
            graphqlHttp((req) => ({
                schema: schema,
                graphiql: process.env.NODE_ENV.trim() === 'development',
                context: req['context']
            }))
        );
    }
}

export default new App().express;`;

    fs.writeFile(`./${__projName}/src/app.ts`, app, (err) => {if (err) throw err;});
}

/**
 * Pasta config
 * config
 */
createFile.prototype.config = () => {
    let dialectOpt = '';
    if (__dialect === 'mssql') {
        dialectOpt = `,
        "dialectOptions": {
            "instanceName": "MSSQLSERVER",
            "encrypt": true
        }`;
    }
    const config = `{
    "development": {
        "username": "root",
        "password": null,
        "database": "database_development",
        "host": "127.0.0.1",
        "dialect": "${__dialect}"${dialectOpt}
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "${__dialect}"${dialectOpt}
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "${__dialect}"${dialectOpt}
    }
}
`;
    
    fs.writeFile(`./${__projName}/src/config/config.json`, config, (err) => {if (err) throw err;});
}

/**
 * Pasta utils.
 * utils
 */
createFile.prototype.utils = () => {
    const utils = `import { Server } from 'http';
import { AddressInfo } from 'net';

export const normalizePort = (val: number | string): number => {
    return (typeof val === 'string') ? parseInt(val) : val;
}

export const onError = (server: Server) => {
    return (error: NodeJS.ErrnoException): void => {
        const address: AddressInfo | string = server.address();
        const port: number | string = (typeof address === 'string') ? address : address.port;
        if (error.syscall !== 'listen') throw error;
        let bind = (typeof port === 'string') ? 'pipe' + port : 'port' + port;
        switch(error.code) {
            case 'EACCES':
                console.error(bind + 'requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + 'is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}

export const onListening = (server: Server) => {
    return (): void => {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? 'pipe' + addr : 'http://' + addr.address + ':' + addr.port;
        console.log('Listening at' + bind + '...');
    }
}

export const handleError = (error: Error) => {
    let errorMessage: string = error.name + ':' + error.message;
    if (process.env.NODE_ENV.trim() !== 'test') { console.log(errorMessage) };
    return Promise.reject(new Error(errorMessage));
};

export const throwError = (condition: boolean, message: string): void => {
    if (condition) { throw new Error(message); }
}

export const JWT_SECRET: string = process.env.JWT_SECRET;
`;
    
    fs.writeFile(`./${__projName}/src/utils/utils.ts`, utils, (err) => {if (err) throw err;});
}

/**
 * Pasta graphql.
 * mutation
 */
createFile.prototype.mutation = () => {
    const mutation = `// Here you can add yours schemas.
import { exampleMutations } from './resources/example/example.schema'

const Mutation = \`
    type Mutation {
        \${ exampleMutations }
    }
\`;

export { Mutation }
`;

    fs.writeFile(`./${__projName}/src/graphql/mutation.ts`, mutation, (err) => {if (err) throw err;});
};

/**
 * Pasta graphql.
 * query
 */
createFile.prototype.query = () => {
    const query = `// Here you can add yours queries.
import { exampleQueries } from './resources/example/example.schema'

const Query = \`
    type Query {
        \${ exampleQueries }
    }
\`;

export { Query }
`;

    fs.writeFile(`./${__projName}/src/graphql/query.ts`, query, (err) => {if (err) throw err;});
};

/**
 * Pasta graphql.
 * schema
 */
createFile.prototype.schema = () => {
    const schema = `import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash';

import { Query } from './query';
import { Mutation } from './mutation';

// Import of schemas and resolvers.
import { exampleTypes } from './resources/example/example.schema';
import { exampleResolvers } from './resources/example/example.resolvers';

// Merge the resolvers.
const resolvers = merge(
    exampleResolvers
);

const SchemaDefinition = \`
    type Schema {
        query: Query,
        mutation: Mutation
    }
\`;

export default makeExecutableSchema({
    // Declaration of schemas.
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        exampleTypes,
    ],
    resolvers
});
`;

    fs.writeFile(`./${__projName}/src/graphql/schema.ts`, schema, (err) => {if (err) throw err;});
};

/**
 * Pasta ast.
 * requestedFields
 */
createFile.prototype.requestedFields = () => {
    const requestedFields = `import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';
import { difference, union } from 'lodash';

export class RequestedFields {
    public getFields(info: GraphQLResolveInfo, options?: { keep?: string[], exclude?: string[] }): string[] {
        let fields: string[] = Object.keys(graphqlFields(info));
        if (!options) { return fields; }
        fields = (options.keep) ? union<string>(fields, options.keep) : fields;
        return (options.exclude) ? difference<string>(fields, options.exclude) : fields;
    }
}
`;

    fs.writeFile(`./${__projName}/src/graphql/ast/RequestedFields.ts`, requestedFields, (err) => {if (err) throw err;});
};

/**
 * Pasta composable.
 * composableResolver
 */
createFile.prototype.composableResolver = () => {
    const composable = `import { GraphQLFieldResolver } from 'graphql';

export type ComposableResolver<TSource, TContext> = 
    (fn: GraphQLFieldResolver<TSource, TContext>) => GraphQLFieldResolver<TSource, TContext>;

export function compose<TSource, TContext>(
    ...funcs: Array<ComposableResolver<TSource, TContext>>
): ComposableResolver<TSource, TContext> {

    if (funcs.length === 0) {
        // if no functions return the identity
        return o => {            
            return o;
        };
    }
    
    if (funcs.length === 1) {
        return funcs[0];
    }
    
    const last = funcs[funcs.length - 1];
    return (f: GraphQLFieldResolver<TSource, TContext>): GraphQLFieldResolver<TSource, TContext> => {
        let result = last(f);
        for (let index = funcs.length - 2; index >= 0; index--) {
            const fn = funcs[index];
            result = fn(result);
        }
        return result;
    }
}
`;

    fs.writeFile(`./${__projName}/src/graphql/composable/composable.resolver.ts`, composable, (err) => {if (err) throw err;});
};

/**
 * Pasta dataloaders.
 * dataLoaderFactory
 */
createFile.prototype.dataLoaderFactory = () => {
    const dataLoaderFactory = `import * as DataLoader from 'dataloader';

import { DbConnection } from '../../interfaces/DbConnectionInterface';
import { DataLoaders } from '../../interfaces/DataLoadersInterface';
// Here you can add yours own Loaders;
import { ExampleLoader } from './ExampleLoader';
import { ExampleInstance } from '../../models/ExampleModel';

import { RequestedFields } from '../ast/RequestedFields';
import { DataLoaderParam } from '../../interfaces/DataLoaderParamInterface';

export class DataLoaderFactory {
    constructor( private db: DbConnection, private requestedFields: RequestedFields ) { }

    public getLoaders(): DataLoaders {
        return {
            exampleLoader: new DataLoader<DataLoaderParam<number>, ExampleInstance>(
                (params: DataLoaderParam<number>[]) => ExampleLoader.batchExamples(this.db.Example, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            )
        };
    }
}
`;

    fs.writeFile(`./${__projName}/src/graphql/dataloaders/DataLoaderFactory.ts`, dataLoaderFactory, (err) => {if (err) throw err;});
};

/**
 * Pasta dataloaders.
 * exampleLoader
 */
createFile.prototype.exampleLoader = () => {
    const exampleLoader = `import { ExampleModel, ExampleInstance } from "../../models/ExampleModel";
import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";

export class ExampleLoader {
    static batchExamples(Example: ExampleModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<ExampleInstance[]> {
        let ids: number[] = params.map(param => param.key);

        return Promise.resolve(
            Example.findAll({
                where: { id: { $in: ids } },
                attributes: requestedFields.getFields(params[0].info, { keep: ['id'], exclude: ['createdAt'] })
            })
        );
    }
    }
`;

    fs.writeFile(`./${__projName}/src/graphql/dataloaders/ExampleLoader.ts`, exampleLoader, (err) => {if (err) throw err;});
}

/**
 * Pasta resources/example.
 * example.resolvers.ts
 */
createFile.prototype.exampleResolvers = () => {
    const exampleResolvers = `import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { ExampleInstance } from "../../../models/ExampleModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { RequestedFields } from "../../ast/RequestedFields";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const exampleResolvers = {
    Query: {
        examples: (parent, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Example
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']})
                }).catch(handleError);
        },

        example: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = Number.parseInt(id);
            return context.db.Example
                .findById(id, { attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['posts']}) })
                .then((example: ExampleInstance) => {
                    throwError(!example, \`Example with id \${ id } not found!\`);
                    return example;
                }).catch(handleError);
        }
    },

    Mutation: {
        createExample: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Example
                    .create(input, { transaction: t });
            }).catch(handleError);
        },

        updateExample: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Example
                    .findById(id)
                    .then((example: ExampleInstance) => {
                        throwError(!example, \`Example with id \${ id } not found!\`);
                        return example.update(input, { transaction: t });
                    });
            }).catch(handleError);
        },

        updateExamplePassword: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Example
                    .findById(id)
                    .then((example: ExampleInstance) => {
                        throwError(!example, \`Example with id \${ id } not found!\`);
                        return example.update(input, { transaction: t })
                            .then((example: ExampleInstance) => !!example);
                    });
            }).catch(handleError);
        },

        deleteExample: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Example
                    .findById(id)
                    .then((example: ExampleInstance) => {
                        throwError(!example, \`Example with id \${ id } not found!\`);
                        return example.destroy({ transaction: t })
                            .then((example: any) => !!example);
                    });
            }).catch(handleError);
        }
    }
};
`;

    fs.writeFile(`./${__projName}/src/graphql/resources/example/example.resolvers.ts`, exampleResolvers, (err) => {if (err) throw err;});
}

/**
 * Pasta resources/example.
 * example.schema.ts
 */
createFile.prototype.exampleSchema = () => {
    const exampleSchema = `const exampleTypes = \`
    type Example {
        id: ID!
        name: String!
        email: String!
        createdAt: String!
        updatedAt: String!
    }
    input ExampleCreateInput {
        name: String!
        email: String!
        password: String!
    }
    input ExampleUpdateInput {
        name: String!
        email: String!
    }
    input ExampleUpdatePasswordInput {
        password: String!
    }
\`;

const exampleQueries = \`
    examples(first: Int, offset: Int): [ Example! ]!
    example(id: ID!): Example
\`;

const exampleMutations = \`
    createExample(input: ExampleCreateInput!): Example
    updateExample(input: ExampleUpdateInput!): Example
    updateExamplePassword(input: ExampleUpdatePasswordInput!): Boolean
    deleteExample: Boolean
\`;

export { exampleTypes, exampleQueries, exampleMutations }
`;

    fs.writeFile(`./${__projName}/src/graphql/resources/example/example.schema.ts`, exampleSchema, (err) => {if (err) throw err;});
}

/**
 * Pasta interfaces.
 * baseModelInterface
 */
createFile.prototype.baseModelInterface = () => {
    const baseModelInterface = `import { Models } from 'sequelize';

export interface BaseModelInterface {

    prototype?;
    associate?(models: Models): void;

}
`;

    fs.writeFile(`./${__projName}/src/interfaces/BaseModelInterface.ts`, baseModelInterface, (err) => {if (err) throw err;});
}

/**
 * Pasta interfaces.
 * dataLoaderParamInterface
 */
createFile.prototype.dataLoaderParamInterface = () => {
    const dataLoaderParamInterface = `import { GraphQLResolveInfo } from "graphql";

export interface DataLoaderParam<T> {
    key: T;
    info: GraphQLResolveInfo;
}
`;

    fs.writeFile(`./${__projName}/src/interfaces/DataLoaderParamInterface.ts`, dataLoaderParamInterface, (err) => {if (err) throw err;});
}

/**
 * Pasta interfaces.
 * dataLoadersInterface
 */
createFile.prototype.dataLoadersInterface = () => {
    const dataLoadersInterface = `import * as DataLoader from 'dataloader';
import { ExampleInstance } from '../models/ExampleModel';
import { DataLoaderParam } from './DataLoaderParamInterface';

export interface DataLoaders {
    exampleLoader: DataLoader<DataLoaderParam<number>, ExampleInstance>;
}
`;

    fs.writeFile(`./${__projName}/src/interfaces/DataLoadersInterface.ts`, dataLoadersInterface, (err) => {if (err) throw err;});
}

/**
 * Pasta interfaces.
 * dbConnectionInterface
 */
createFile.prototype.dbConnectionInterface = () => {
    const dbConnectionInterface = `import * as Sequelize from "sequelize";

import { ModelsInterface } from "./ModelsInterface";

export interface DbConnection extends ModelsInterface {

    sequelize: Sequelize.Sequelize;

}
`;

    fs.writeFile(`./${__projName}/src/interfaces/DbConnectionInterface.ts`, dbConnectionInterface, (err) => {if (err) throw err;});
}

/**
 * Pasta interfaces.
 * modelsInterface
 */
createFile.prototype.modelsInterface = () => {
    const modelsInterface = `import { ExampleModel } from "../models/ExampleModel";

export interface ModelsInterface {

    Example: ExampleModel;

}
`;

    fs.writeFile(`./${__projName}/src/interfaces/ModelsInterface.ts`, modelsInterface, (err) => {if (err) throw err;});
}

/**
 * Pasta interfaces.
 * resolverContextInterface
 */
createFile.prototype.resolverContextInterface = () => {
    const resolverContextInterface = `import { DbConnection } from "./DbConnectionInterface";
import { DataLoaders } from "./DataLoadersInterface";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export interface ResolverContext {
    db?: DbConnection;
    dataLoaders?: DataLoaders;
    requestedFields?: RequestedFields;
}
`;

    fs.writeFile(`./${__projName}/src/interfaces/ResolverContextInterface.ts`, resolverContextInterface, (err) => {if (err) throw err;});
}

/**
 * Pasta models.
 * index
 */
createFile.prototype.modelIndex = () => {
    const modelIndex = `import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';

import { DbConnection } from '../interfaces/DbConnectionInterface';

const basename: string = path.basename(module.filename);
let env: string = process.env.NODE_ENV.trim() || 'development';
let config = require(path.resolve(\`\${__dirname}\`, '../config/config.json'))[env];
let db = null;

if(!db) {
    db = {};

    const operatorsAliases = {
        $in: Sequelize.Op.in
    };

    config = Object.assign({operatorsAliases}, config);

    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );

    fs
        .readdirSync(__dirname)
        .filter((file: string) => {
            const fileSlice: string = file.slice(-3);
            return (file.indexOf('.') !== 0) && (file !== basename) && ((fileSlice === '.js') || (fileSlice === '.ts'));
        })
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;

        });

    Object.keys(db).forEach((modelName: string) => {
        if(db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db['sequelize'] = sequelize;
}

export default <DbConnection>db;
`;

    fs.writeFile(`./${__projName}/src/models/index.ts`, modelIndex, (err) => {if (err) throw err;});
}

/**
 * Pasta models.
 * exampleModel
 */
createFile.prototype.exampleModel = () => {
    const exampleModel = `import * as Sequelize from "sequelize";
import { genSaltSync, hashSync, compareSync } from 'bcryptjs'

import { BaseModelInterface } from "../interfaces/BaseModelInterface";

export interface ExampleAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export interface ExampleInstance extends Sequelize.Instance<ExampleAttributes>, ExampleAttributes {
    isPassword(encodedPassword: string, password: string): boolean;
}

export interface ExampleModel extends BaseModelInterface, Sequelize.Model<ExampleInstance, ExampleAttributes> { }

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): ExampleModel => {
    const Example: ExampleModel = sequelize.define('Example', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        tableName: 'examples',
        hooks: {
            beforeCreate: (example: ExampleInstance, options: Sequelize.CreateOptions): void => {
                const salt = genSaltSync();
                example.password = hashSync(example.password, salt);
            },
            beforeUpdate: (example: ExampleInstance, options: Sequelize.CreateOptions): void => {
                if(example.changed('password')) {
                    const salt = genSaltSync();
                    example.password = hashSync(example.password, salt);
                }
            }
        }
    });

    Example.associate = (models: Sequelize.Models): void  => {};

    Example.prototype.isPassword = (encodedPassword: string, password: string): boolean => {
        return compareSync(password, encodedPassword);
    };

    return Example;
};
`;

    fs.writeFile(`./${__projName}/src/models/ExampleModel.ts`, exampleModel, (err) => {if (err) throw err;});
}


/*  ---------- Initial Files ----------  */

/**
 * createModel
 * @param name
 */
createFile.prototype.createModel = (name) => {
    const model = `import * as Sequelize from "sequelize";

import { BaseModelInterface } from "../interfaces/BaseModelInterface";

export interface ${name}Attributes { }

export interface ${name}Instance extends Sequelize.Instance<${name}Attributes>, ${name}Attributes { }

export interface ${name}Model extends BaseModelInterface, Sequelize.Model<${name}Instance, ${name}Attributes> { }

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): ${name}Model => {
    const ${name}: ${name}Model = sequelize.define('${name}', {
        // Fields are defined here! Like:
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        // Pay attention in table name.
        tableName: '${name}'
    });

    ${name}.associate = (models: Sequelize.Models): void  => {};

    return ${name};
};
`;

    fs.writeFile(`./src/models/${name}Model.ts`, model, (err) => {if (err) throw err;});
}

/**
 * createResolvers
 * @param name
 */
createFile.prototype.createResolvers = (name) => {
    const resolvers = `import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { ExampleInstance } from "../../../models/ExampleModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { RequestedFields } from "../../ast/RequestedFields";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const ${name}Resolvers = {
    Query: { },

    Mutation: { }
};
`;

    fs.writeFile(`./src/graphql/resources/${name}/${name}.resolvers.ts`, resolvers, (err) => {if (err) throw err;});
}

/**
 * createSchema
 * @param name
 */
createFile.prototype.createSchema = (name) => {
    const schema = `const ${name}Types = \`
    type ${name} { }
    input ${name}Input { }
\`;

const ${name}Queries = \`\`;

const ${name}Mutations = \`\`;

export { ${name}Types, ${name}Queries, ${name}Mutations }
`;

    fs.writeFile(`./src/graphql/resources/${name}/${name}.schema.ts`, schema, (err) => {if (err) throw err;});
}

module['exports'] = createFile;
