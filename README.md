# xml-beautify
[![npm version](https://badge.fury.io/js/xml-beautify.svg)](https://badge.fury.io/js/xml-beautify)

[comment]: <> ([![CircleCI]&#40;https://circleci.com/gh/riversun/xml-beautify/tree/master.svg?style=shield&#41;]&#40;https://circleci.com/gh/riversun/xml-beautify/tree/master&#41;)
[![codecov](https://codecov.io/gh/riversun/xml-beautify/branch/master/graph/badge.svg?token=5ODIRDVDLF)](https://codecov.io/gh/riversun/xml-beautify)

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


## Example of result

 
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
      <element></element><foo><![CDATA[ < > & ]]></foo>
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
      <foo><![CDATA[ < > & ]]></foo>
    </element>
  </body>
</example>

```


# Install
## install via npm

```shell
npm install xml-beautify
```

## use from CDN

```
<script src="https://cdn.jsdelivr.net/npm/xml-beautify@1.2.1/dist/XmlBeautify.js"></script>
```

# Demo
## demo on the web
https://riversun.github.io/xml-beautify/index.html

## demo on node.js

**clone this project and type**

```shell
git clone https://github.com/riversun/xml-beautify.git
npm start
```

# Run on Browser

```javascript
<!DOCTYPE html>
<html lang="en">
<body>
<script src="https://cdn.jsdelivr.net/npm/xml-beautify@1.2.1/dist/XmlBeautify.js"></script>
<script>
  const srcXmlText = `<?xml version="1.0" encoding="utf-8"?><example version="2.0">
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
</example>`;

  const beautifiedXmlText = new XmlBeautify().beautify(srcXmlText);
  console.log(beautifiedXmlText);


</script>
</body>
</html>

```

# Run on Node.js

To run XmlBeautify on node.js, need to install an external DOMParser like as follows.

```
npm install xmldom 
```

And specify it as follows,

```javascript
new XmlBeautify({ parser: DOMParser })
```

- Example for Node.js

```javascript
const XmlBeautify = require('xml-beautify');
const { DOMParser } = require('xmldom');// When used in a node.js environment, DOMParser is needed.
const srcXmlText = `<?xml version="1.0" encoding="utf-8"?><example version="2.0">
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
</example>`;

const beautifiedXmlText = new XmlBeautify({ parser: DOMParser }).beautify(srcXmlText);
console.log(beautifiedXmlText);

```
