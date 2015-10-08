'use strict';
/* global module, require, __dirname */

var isEmptyObject = require('is-empty-object');
var JSONStream = require('JSONStream');
var assign = require('object-assign');
var traverse = require('traverse');
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
    stream.emit('complete');
  }.bind(this));

  output.write('# Jade Documentation \n\n');


  /**
   * Create markdown snippet
   */
  
  function createSnippet(obj){
    var lines = [];

    // push name to markdown output
    lines.push('## '+ obj.meta.name);
    lines.push(obj.meta.description);
    lines.push('\n');

    // traverse all arguments
    // and indent according to level
    var spaces;
    var arg;

    traverse(obj.meta).forEach(function(x){

      // check for empty object
      if(isEmptyObject(x)){
        return;
      }

      if(this.key === 'name'){
        return;
      }

      if(this.key === 'description'){
        return;
      }

      if(typeof this.key === 'undefined'){
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
    lines.push(obj.source);
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

  var stream = JSONStream.parse('*');
    stream.on('data', function(data){
    
    // create code snippet
    var snippet = createSnippet(data);

    // push lines
    output.write(snippet);
  });

  stream.on('end', function(){
    output.end();
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

      // end stream
      stream.push(null);
      stream.end();
      
    }.bind(this));
  }

  return stream;
}

module.exports = JadeDocMarkdown;