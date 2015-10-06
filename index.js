'use strict';
/* global module, require, __dirname */

var isEmptyObject = require('is-empty-object');
var assign = require('object-assign');
var traverse = require('traverse');
var through2 = require('through2');
var mkdirp = require('mkdirp');
var pretty = require('pretty');
var path = require('path');
var fs = require('fs');


/**
 * Create markdown file from 
 * jade-doc stream or json file
 */

function JadeDocMarkdown(options){

  if(typeof options.output === 'undefined'){
    throw new Error('Jade doc markdown requires settings.output to be set.');
  }
  

  // options
  options = assign({
    input: null,
    output: null
  }, options);


  // create output file
  mkdirp.sync(path.dirname(options.output));
  var output = fs.createWriteStream(options.output);
  output.on('close', function(){
    stream.emit('end');
  }.bind(this));

  output.write('# Jade Documentation \n\n');


  /**
   * Create markdown snippet
   */
  
  function createSnippet(obj){
    var lines = [];

    // push name to markdown output
    lines.push('## '+ obj.meta.name);
    delete obj.meta.name;

    // traverse all arguments
    // and indent according to level
    var spaces;
    var arg;

    traverse(obj.meta).forEach(function(x){

      // check for empty object
      if(isEmptyObject(x)){
        return;
      }

      // set indentation
      spaces = new Array(this.level).join(' ');
      arg = [];
      arg.push(spaces);
      arg.push(this.key);

      if(typeof x !== 'object'){
        arg.push(': ');
        arg.push(x);
      }

      lines.push(arg.join(''));
    });
    lines.push('');

    // push jade snippet
    lines.push('```jade');
    lines.push(pretty(obj.source));
    lines.push('```');
    lines.push('');

    // push html snippet
    lines.push('```html');
    lines.push(pretty(obj.output));
    lines.push('```');

    // whitespace
    lines.push('');
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }


  /**
   * Output stream
   */

  var stream = through2(function(chunk, enc, next){

    // create code snippet
    var snippet = createSnippet(JSON.parse(chunk));

    // push lines
    output.write(snippet);

    // push stream
    this.push(chunk);
    next();
  });


  /**
   * Input from file
   */
  
  if(typeof options.input !== 'undefined'){

    // read input json
    var input = fs.createReadStream(__dirname +'/'+ options.input);
    input.on('data', function(data){

      var json = JSON.parse(data.toString());

      var snippet;
      json.forEach(function(obj){

        // create code snippet
        snippet = createSnippet(obj);

        // append json data to template
        output.write(snippet);
      });

      output.end();
      
    }.bind(this));
  }

  return stream;
}

module.exports = JadeDocMarkdown;