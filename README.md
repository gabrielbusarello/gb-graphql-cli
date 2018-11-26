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
5. 