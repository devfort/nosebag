#!/usr/bin/env node

var path = require('path'),
    { Search } = require('../lib/search/command');

var command = new Search(
  '/Users/jaylett/projects/devfort/nosebag/dr.syntax',
  console.log,
);

command.run(process.argv.slice(2));
