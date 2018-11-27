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
Usage: cli [options] [command]

Options:

  -v, --version    output the version number
  -h, --help       output usage information

Commands:

  init <projname>  Init the GraphQL project
  run              Start the development server

Examples:
  gb-graphql-cli init helloWorld

```

## How to Use - Initializing a new GraphQL project
Assuming that you have installed the cli, follow the steps below for run your first application.
1. The first step, is initialize the project:
```sh
gb-graphql-cli init helloWorld
```
2. After the initialization finishes, you have to start your database service and create a database named "helloWorld".
3. With database service started, go to config.json file, located in "helloWorld/src/config/config.json".
4. Change the "database" key, of key "development" to the name "helloWorld".
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
5. Now it's time to run the application. Go to main of your project and type `gb-graphql-cli run`.
6. Wait for the build and the nodemon server being ready.
7. Access `localhost:3000/graphql`. As this application is from GraphQL, just have one end-point. In development environment, accessing this end-point in browser you will see the Graph*i*QL interface.
8. Now you can create mutations and queries for the ExampleModel.
9. Enjoy!