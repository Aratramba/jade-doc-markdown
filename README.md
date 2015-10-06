# Jade-doc Markdown

Generates Markdown output from a [Jade-doc](http://github.com/Aratramba/jade-doc/) stream or input jade-doc json.


### Command Line
```bash
jade-doc-markdown --input jade-doc.json --output output.md
```

```bash
jade-doc input.jade | jade-doc-markdown --output output.md
```


### Node
```js
var jdm = new JadeDocMarkdown({
    output: 'output.html',
    input: 'data.json'
});

jdm.on('end', function(){
  console.log('complete');
});
```