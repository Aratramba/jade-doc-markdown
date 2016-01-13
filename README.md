# Pug-doc Markdown

Generates Markdown output from a [Pug-doc](http://github.com/Aratramba/pug-doc/) stream or input pug-doc json.


### Command Line
```bash
pug-doc-markdown --input pug-doc.json --output output.md
```

```bash
pug-doc input.jade | pug-doc-markdown --output output.md
```


### Node
```js
var stream = new PugDocMarkdown({
    output: 'output.html',
    input: 'data.json'
});

stream.on('complete', function(){
  console.log('complete');
});
```