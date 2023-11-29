# Spartacus Installation Guidelines

[SAP reference link](https://sap.github.io/spartacus-docs/building-the-spartacus-storefront-from-libraries-4-x/)

## Prerequisites

Your Angular development environment should include the following: 

[Angular CLI](https://angular.io/): Version `12.0.5` or later, < 13.
[Yarn](https://classic.yarnpkg.com/): Version `1.15` or later.  
[Node.js](https://nodejs.org/en/download/): The most recent `16.x` version is required. To install Nodejs software use the link  
[Visual Studio code](https://code.visualstudio.com/ )

Get the code from the Azure GIT repository 
`git clone https://fb-gt-ecommerce@dev.azure.com/fb-gt-ecommerce/FB.Dimond/_git/FB.Dimond`

once we get the code from repository then run the below command to install the node package manager 
`cd FB.Dimond`
`npm install --legacy-peer-deps or npm install (for MAC user yarn install)`

Change `baseUrl` to `https://localhost:9002` in file `src\app\spartacus\spartacus-configuration.module.ts`

Once node package manager(npm) installed then the run the below command to access the store

`ng serve --open (for MAC user yarn start)`

Once local build is successful, localhost URL will be automatically open in default browser `http://localhost:4200/`

 

# Angular Details

# Dimondroofing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.18.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
