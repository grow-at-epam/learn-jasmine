# Jasmine Study Note

Jasmine provides various CLIs as well as the *Jasmine Standalone* for executing unit tests.
These CLIs are just wrappers of the Standalone, and are used to meet the needs of testing javascript
tests in different language environments, e.g. Ruby, Python and NodeJS.

> In this Repo, we are going to discuss the usage of Jasmine in NodeJS environment.

## Setup

Following these steps to setup Jasmine:

- Creating NodeJS project: `npm init -y`
- Installing Jasmine: `npm i jasmine`
- Initializing Jasmine project: `npx jasmine init`
- Installing examples as a start point: `npx jasmine examples`

Here are what I use throughout this study note.

```
$ node -v && npm -v && npx jasmine -v
v8.11.3
6.9.0
jasmine v3.3.1
jasmine-core v3.3.0
```

## Customization

It's always disgusting to `import` or `require` modules with relative paths relative to
the location of the files importing or requiring them, which requires you to use something like
`../../` to go up the directory tree to the source directory and then navigate to the source file.
It's not a big problem if you have a flat directory tree, but it's indeed irritated
if the code base is huge. 

I usually prefer using paths relative to the project root, to achieve that goal I use jasmine
as a library, so that I can update `NODE_PAHT` environment variable to include the project root,
before starting Jasmine runner. The details are as follow.

Create a file `jasmine-runner.js` (the file name is not important, use whatever you want) with
the follow content:

```
process.env.NODE_PATH=__dirname;
require("module")._initPaths();

const Jasmine = require("jasmine");
const jasmine = new Jasmine();
jasmine.loadConfigFile("spec/support/jasmine.json");
jasmine.execute();
```

The first line updates NODE\_PATH environment variable and the second line gets the configuration
to take effect. The rest of code runs Jasmine through NodeJS API.

> The problem here is that if we run tests with jasmine command directly on CLI there will be
> resolving issues if you are referencing modules relatively to project root.

