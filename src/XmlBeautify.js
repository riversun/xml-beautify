/*
 * xml-beautify - pretty-print text in XML formats.
 *
 * Copyright (c) 2018 Tom Misawa, riversun.org@gmail.com
 *
 * MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Usage:
 *
 *       const resultXmlText = new XmlBeautify().beautify(textInput.value,
 *       {
 *            indent: '  ',  //indent pattern like white spaces
 *            useSelfClosingElement: true //true:use self-closing element when empty element.
 *       });
 *
 * How "useSelfClosingElement" property works.
 *
 *   useSelfClosingElement:true
 *   <foo></foo> ==> <foo/>
 *
 *   useSelfClosingElement:false
 *   <foo></foo> ==> <foo></foo>
 *
 */
const ELEMENT_NODE = 1;
const ATTRIBUTE_NODE = 2;
const TEXT_NODE = 3;
const CDATA_SECTION_NODE = 4;
const PROCESSING_INSTRUCTION_NODE = 7;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;
const DOCUMENT_TYPE_NODE = 10;
const DOCUMENT_FRAGMENT_NODE = 11;
export default class XmlBeautify {
  constructor(option) {
    const opt = option || {};
    this.userExternalParser = false;
    if (opt.parser) {
      this.userExternalParser = true;
      this.parser = new opt.parser();
    } else {
      this.parser = new DOMParser();
    }
  }

  hasXmlDef(xmlText) {
    return xmlText.indexOf('<?xml') >= 0;
  }

  getEncoding(xmlText) {
    const me = this;
    if (!me.hasXmlDef(xmlText)) {
      return null;
    }

    const encodingStartPos = xmlText.toLowerCase().indexOf('encoding="') + 'encoding="'.length;
    const encodingEndPos = xmlText.indexOf('"?>');
    const encoding = xmlText.substr(encodingStartPos, encodingEndPos - encodingStartPos);
    return encoding;
  }


  /**
   * Returns Array of ELEMENT_NODE-child
   * @param element
   * @returns {*[]}
   * @private
   */
  _children(element) {
    const _ret = [];
    const numOfChildNodes = element.childNodes.length;
    for (let i = 0; i < numOfChildNodes; i++) {
      if (element.childNodes[i].nodeType === ELEMENT_NODE) {
        _ret.push(element.childNodes[i]);
      }
    }
    return _ret;
  }

  beautify(xmlText, data) {
    const me = this;

    const doc = me.parser.parseFromString(xmlText, 'text/xml');

    let indent = '  ';
    const encoding = 'UTF-8';
    let useSelfClosingElement = false;

    if (data) {
      if (data.indent) {
        indent = data.indent;
      }

      if (data.useSelfClosingElement == true) {
        useSelfClosingElement = data.useSelfClosingElement;
      }
    }

    let xmlHeader = null;

    if (me.hasXmlDef(xmlText)) {
      const encoding = me.getEncoding(xmlText);
      xmlHeader = '<?xml version="1.0" encoding="' + encoding + '"?>';
    }
    const buildInfo = {
      indentText: indent,
      xmlText: '',
      useSelfClosingElement: useSelfClosingElement,
      indentLevel: 0
    }

    if (me.userExternalParser) {
      me._parseInternally(this._children(doc)[0], buildInfo);
    } else {
      me._parseInternally(doc.children[0], buildInfo);
    }

    let resultXml = '';

    if (xmlHeader) {
      resultXml += xmlHeader + '\n';
    }
    resultXml += buildInfo.xmlText;

    return resultXml;
  };

  _parseInternally(element, buildInfo) {
    const me = this;

    let elementTextContent = element.textContent;

    const blankReplacedElementContent = elementTextContent.replace(/ /g, '').replace(/\r?\n/g, '').replace(/\n/g, '').replace(/\t/g, '');

    if (blankReplacedElementContent.length == 0) {
      elementTextContent = '';
    }


    let elementHasNoChildren;
    if (me.userExternalParser) {
      elementHasNoChildren = !(me._children(element).length > 0);
    } else {
      elementHasNoChildren = !(element.children.length > 0);
    }

    const elementHasValueOrChildren = (elementTextContent && elementTextContent.length > 0);
    const elementHasItsValue = elementHasNoChildren && elementHasValueOrChildren;
    const isEmptyElement = elementHasNoChildren && !elementHasValueOrChildren;

    const useSelfClosingElement = buildInfo.useSelfClosingElement;

    const startTagPrefix = '<';
    const startTagSuffix = '>';
    const startTagSuffixEmpty = ' />';
    const endTagPrefix = '</';
    const endTagSuffix = '>';

    let valueOfElement = '';

    if (elementHasItsValue) {
      const { hasCDATAChild, content } = me._getFirstCDATAChild(element);

      if (hasCDATAChild) {
        valueOfElement += content;
      } else {
        valueOfElement += elementTextContent;
      }
    }

    let indentText = '';

    for (let idx = 0; idx < buildInfo.indentLevel; idx++) {
      indentText += buildInfo.indentText;
    }
    buildInfo.xmlText += indentText;
    buildInfo.xmlText += startTagPrefix + element.tagName

    //add attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      buildInfo.xmlText += ' ' + attr.name + '=' + '"' + attr.textContent + '"';
    }

    if (isEmptyElement && useSelfClosingElement) {
      buildInfo.xmlText += startTagSuffixEmpty;

    } else {
      buildInfo.xmlText += startTagSuffix;
    }

    if (elementHasItsValue) {
      buildInfo.xmlText += valueOfElement;
    } else {

      if (isEmptyElement && !useSelfClosingElement) {
      } else {
        buildInfo.xmlText += '\n';
      }

    }

    buildInfo.indentLevel++;

    let lengOfChildren;

    if (me.userExternalParser) {
      lengOfChildren = me._children(element).length;
    } else {
      lengOfChildren = element.children.length;
    }

    for (let i = 0; i < lengOfChildren; i++) {
      let child;
      if (me.userExternalParser) {
        child = me._children(element)[i];
      } else {
        child = element.children[i];
      }
      me._parseInternally(child, buildInfo);
    }
    buildInfo.indentLevel--;

    if (isEmptyElement) {
      if (useSelfClosingElement) {

      } else {
        const endTag = endTagPrefix + element.tagName + endTagSuffix;
        buildInfo.xmlText += endTag;
        buildInfo.xmlText += '\n';
      }
    } else {
      const endTag = endTagPrefix + element.tagName + endTagSuffix;

      if (!(elementHasNoChildren && elementHasValueOrChildren)) {
        buildInfo.xmlText += indentText;
      }
      buildInfo.xmlText += endTag;
      buildInfo.xmlText += '\n';
    }
  };


  /**
   * Return the CDATA section in the first child element of element.
   * If not exists, returns  { hasCDATAChild:false }
   * @param element
   * @returns {*}
   * @private
   */
  _getFirstCDATAChild(element) {
    const numOfChildNodes = element.childNodes.length;// numOfChildNodes should be 1
    let textContent = ``;
    let hasCDATA = false;
    for (let i = 0; i < numOfChildNodes; i++) {
      if (element.childNodes[i].nodeType === TEXT_NODE) {

        const data = element.childNodes[i].data;
        const blankReplacedElementContent = data.replace(/ /g, '').replace(/\r?\n/g, '').replace(/\n/g, '').replace(/\t/g, '');

        if (blankReplacedElementContent.length > 0) {
          textContent += element.childNodes[i].data;
        }
      } else if (element.childNodes[i].nodeType === CDATA_SECTION_NODE) {
        const data = element.childNodes[i].data;
        textContent += '<![CDATA[';
        textContent += data;
        textContent += ']]>';
        hasCDATA = true;
      }
    }
    if (hasCDATA) {
      return { hasCDATAChild: true, content: textContent };
    }
    return { hasCDATAChild: false };
  }

}
