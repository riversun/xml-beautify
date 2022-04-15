/**
 * To use it with node.js, install an external DOMParser as follows
 * `npm install @xmldom/xmldom`
 * @type {*}
 */
const XmlBeautify = require("../dist/XmlBeautify.js");
const { DOMParser } = require('@xmldom/xmldom');// When used in a node.js environment, DOMParser is needed.
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
    </element><foo>Here is a CDATA section: <![CDATA[ < > & ]]> with all kinds of unescaped text.</foo>
  </body>
</example>`;

const beautifiedXmlText = new XmlBeautify({ parser: DOMParser })
  .beautify(srcXmlText, {
    indent: "  ",  //indent pattern like white spaces
    useSelfClosingElement: true //true:use self-closing element when empty element.
  });

console.log(beautifiedXmlText);

