# Jade Documentation 

## foo

```jade
div.foo
```

```html
<div class="foo"></div>
```


---


## faa

```jade
div.faa
```

```html
<div class="faa"></div>
```


---


## mixin
description: this is a mixin
arguments
 one: hello
 two: world
foo: faa
beep: boop
list: foo faa

```jade
mixin foo(one, two)
  p #{one}
  p #{two}
```

```html
<p>hello</p>
<p>world</p>
```


---


