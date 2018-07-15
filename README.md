# Overview
xml-beautify - pretty-print text in XML formats.

It is licensed under [MIT license](https://opensource.org/licenses/MIT).

# How to use?

```javascript
var beautifiedXmlText = new XmlBeautify().beautify(srcXmlText, 
    {
        indent: "  ",  //indent pattern like white spaces
        useSelfClosingElement: true //true:use self-closing element when empty element.
    });

```

# Demo
## demo on the web
https://riversun.github.io/xml-beautify/index.html

### download standalone *.js

https://github.com/riversun/xml-beautify/blob/master/dist/XmlBeautify.js

<hr>

## demo on node.js

**clone this project and type**

```shell
git clone https://github.com/riversun/xml-beautify.git
npm start
```

### install via npm

```shell
npm install xml-beautify
```


## Example

 
[BEFORE] source XML
```XML
<?xml version="1.0" encoding="utf-8"?><example version="2.0">
  <head>
    <title>Original Title</title>
  </head>
  <body>
    <element message="Greeting" title="Chapter1">
      <element message="We say good morning in the morning."></element><element message="We say hello at noon."/>
      <element message="We say good evening at night."/>
    </element>
    <element message="Thank" title="Chapter2">
      <element>value</element>
      <element></element>
    </element>
  </body>
</example>
```

[AFTER] beautified XML
```XML
<?xml version="1.0" encoding="utf-8"?>
<example version="2.0">
  <head>
    <title>Original Title</title>
  </head>
  <body>
    <element message="Greeting" title="Chapter1">
      <element message="We say good morning in the morning." />
      <element message="We say hello at noon." />
      <element message="We say good evening at night." />
    </element>
    <element message="Thank" title="Chapter2">
      <element>value</element>
      <element />
    </element>
  </body>
</example>

```