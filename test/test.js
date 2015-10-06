'use strict';
/* global require */

var test = require('tape');
var JadeDocMarkdown = require('../');
var fs = require('fs');


/**
 * Dumb test to check if output markdown is as expected
 */

test('test input / output', function(assert){
  assert.plan(1);

  var options = {
    output: './test/tmp/output.md',
    input: './test/fixtures/data.json'
  };

  var stream = new JadeDocMarkdown(options);

  stream.on('complete', function(){
    var actual = fs.readFileSync(options.output).toString();
    var expected = fs.readFileSync('./test/fixtures/output.md').toString();
    assert.equal(actual, expected, 'output markdown should be equal to fixture markdown.');
  });
});