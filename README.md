# Overview

API Code will ideally be written with [REST design patterns](https://blog.stoplight.io/api-design-patterns-for-rest-web-services), [MVC project structure](https://developer.mozilla.org/en-US/docs/Glossary/MVC) and [SOLID principals](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design). This source code uses the [NodeJS Runtime Environment](https://nodejs.org/en/) and the [ExpressJS Framework](https://expressjs.com/). For detailed information on the stack used __you should always check the online documentation & communities for the most up to date information.__  

### Project Dependencies
- [NodeJS Runtime Environment](https://nodejs.org/en/)
    - [ExpressJS](https://expressjs.com/)
    - [Dotenv](https://www.npmjs.com/package/dotenv)
    - [Sequelize](https://sequelize.org/)
    - [ValidatorJS](https://github.com/mikeerickson/validatorjs)
    - [Luxon](https://www.npmjs.com/package/luxon)
    - [JsonWebToken](https://github.com/auth0/node-jsonwebtoken)

### Non-Code specific Dependencies
- [Docker](https://www.docker.com/)
- [VS Code](https://code.visualstudio.com/)
    - [VSCode REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

# Development

## Overview

ExpressJS is essentially a chain of middleware, where an incoming request is passed through the middleware chain until a response is sent. Essentially everything in an ExpressJS application is middleware and the middleware chain follows the chronology of which middleware was registered first, meaning that order of registration is critically important to how your request will be handled. Because ExpressJS does not wait for asychronous middleware to complete before moving on to the next middleware in the chain, **__All asychronous middleware will be forced to handle their own errors__**

This template adds some opinions & boiler plate code to our api code repos for faster, easier, and more maintainable development.

## Request Chain
> global-middleware -> route-specific-middleware -> end-of-life-middleware

## Middleware functions vs ExpressJS middleware
Everything in ExpressJS is considered middleware, however in this template we have a classification of function handlers that we call "middleware." **__Middleware in the scope of this template is defined as functions that perform actions before or after the request is handled that is not specific any given route.__** Middleware functions should be stored in the app/http/middleware folder.

## Global middleware & End-of-life Middleware
When a [middleware function](#middleware-functions-vs-expressjs-middleware) needs to be **__applied before or after every request for all routes__** then it can be registered as either global or end-of-life middleware. **Global Middleware** occurs before every request, and **End-of-life** middleware occurs after every request. In order to register a [middleware function](#middleware-functions-vs-expressjs-middleware) as either global or end-of-life you will simple add it to the app/providers/MiddlewareProvider.js file in the appropiate registration function handler.

## Route Specific middleware
Route specific middleware can be a [middleware function](#middleware-functions-vs-expressjs-middleware)

## Run Nodemon locally ( without mock database)

> Nodemon enables hot refresh for your code changes for an easier deving experiencing.

**__In most cases this will require database credentials to be added to .env__**

Change directory to /src and run the following command:  
```
npm run start-dev
```

## Run locally ( with mock database )

With [Docker]() installed on you machine issue the following command from within the root directory:  
> ( The folder that has the docker-compose.yml file )
```
docker-compose up
```
> if you are having issues, try running the following command to force docker to re-build the container
```
docker-compose up --build
```

**__Once docker-compose is finished visit localhost:3000!__**
