
# Traveler

## Instalation

* Install dependencies:
```bash
npm install
```

## Start application

### Development

* Execute in a terminal:
```bash
npm dev
```

* In other terminal run:
```bash
npm serve:dev
```

### Production

* Execute in a terminal:
```bash
npm start
```

### Run project
in the build folder put a new file called foursquare.json with your api keys:
```javascript
{
    CLIENT_ID: 'your-api-client',
    CLIENT_SECRET: 'your-api-secret'
}

```

## Information about this repository.

In this project I used Vanilla Javascript (without frameworks), `Google Maps API` and A `foursquare API`, SASS as a CSS transpiler.

As a constrction tool I used next tools:

| Tool          | Why                  |
| ------------- |:--------------------:|
| Gulp          | As a task manager    |
| Babel         | Javascript transpiler|
| Rollup        | Package Bundler      |

All the source code is in `src` folder, there you can find:

| Folder         | Content                  |
|:---------------|:-------------------------|
|backend         |Server files              |
|templates       |HTML base files           |
|frontend        |Front-End files           |
|frontend/styles |Front-End style files     |
|frontend/scripts|Front-End javascript files|
