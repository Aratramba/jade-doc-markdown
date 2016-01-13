#!/usr/bin/env node
'use strict';
/* global require, process */


var meow = require('meow');
var PugDocMarkdown = require('./index');
var JSONStream = require('JSONStream');

var cli = meow({
  help: [
    'Usage',
    '  $ pug-doc --input file.jade | pug-doc-markdown --output file.md',
    '  $ pug-doc-markdown --input file.json --output file.md',
    '',
    'Options',
    '  --output    Set output markdown file',
    '  --input     Set input json file',
  ]
});


var stream = new PugDocMarkdown({
  input: cli.flags.input, 
  output: cli.flags.output 
});

process.stdin.pipe(stream).pipe(JSONStream.stringify()).pipe(process.stdout);

stream.on('complete', function(){
  process.exit();
});