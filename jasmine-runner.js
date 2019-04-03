process.env.NODE_PATH=__dirname;
require("module")._initPaths();

const Jasmine = require("jasmine");

const jasmine = new Jasmine();

jasmine.loadConfigFile("spec/support/jasmine.json");

jasmine.execute();
