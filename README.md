# GraphQL CLI
A Command Line interface for GraphQL applications.

[![GitHub forks](https://img.shields.io/github/forks/gabrielbusarello/gb-graphql-cli.svg?style=social)](https://github.com/gabrielbusarello/gb-graphql-cli/fork) [![GitHub stars](https://img.shields.io/github/stars/gabrielbusarello/gb-graphql-cli.svg?style=social)](https://github.com/gabrielbusarello/gb-graphql-cli/stargazers)

[![GitHub license](https://img.shields.io/github/license/gabrielbusarello/gb-graphql-cli.svg)](https://github.com/gabrielbusarello/gb-graphql-cli/blob/master/LICENSE)

# Usage

## Installation
```sh
npm install -g gb-graphql-cli
```

### Running `gb-graphql-cli --help`
```sh
Usage: gb-graphql-cli [options] [command]

Options:

  -v, --version              output the version number
  -h, --help                 output usage information

Commands:

  init [options] <projname>  Init the GraphQL project
  run                        Start the development server
  create <schema> <name>     Create files based on a schematic. Possible schemas: (model, resource)

Examples:
   gb-graphql-cli init helloWorld
   gb-graphql-cli init helloWorld -d mssql
   gb-graphql-cli init helloWorld -a
   gb-graphql-cli run
   gb-graphql-cli create model example

```

## How to Use - Initializing a new GraphQL project
Assuming that you have installed the cli, follow the steps below for run your first application.
1. The first step, is initialize the project:
```sh
gb-graphql-cli init helloWorld
# If you are using another DBMS, you can set like that:
# Possible values: (mysql, mssql, sqlite, postgres)
gb-graphql-cli init helloWorld --dialect mssql
```
2. Don't forget that you have to change the JWT_SECRET in package.json.
3. After the initialization finishes, you have to start your database service and create a database named "helloWorld".
4. With database service started, go to config.json file, located in "helloWorld/src/config/config.json".
5. Change the "database" key, of key "development" to the name "helloWorld".
```json
{
    "development": {
        "username": "root",
        "password": null,
        "database": "helloWorld",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}
```
6. Now it's time to run the application. Go to main of your project and type `gb-graphql-cli run`.
7. Wait for the build and the nodemon server being ready.
8. Access `localhost:3000/graphql`. As this application is from GraphQL, just have one end-point. In development environment, accessing this end-point in browser you will see the Graph*i*QL interface.
9. Now you can create mutations and queries for the ExampleModel.
10. Enjoy!