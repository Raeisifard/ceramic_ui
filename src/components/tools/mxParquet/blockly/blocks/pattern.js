import * as Blockly from 'blockly/core';
if (!String.prototype.encodeXML) {
  String.prototype.encodeXML = function () {
    return this.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
}
Blockly.Blocks[ 'pattern_freemarker_interpolate' ] = {
  init: function() {
    this.appendValueInput("INPUT")
      .setCheck("String")
      .appendField("${")
      .appendField(new Blockly.FieldTextInput(""), "FIELD")
      .appendField("}");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(200);
    this.setTooltip("Interpolate");
    this.setHelpUrl("https://freemarker.apache.org/docs/dgui_template_valueinsertion.html");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_interpolate' ] = function(block) {
  const text_field = block.getFieldValue('FIELD');
  const value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `${value_input}\${${text_field}}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'pattern_freemarker_text' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput(""), "text");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(105);
    this.setTooltip("fix text");
    this.setHelpUrl("https://freemarker.apache.org/docs/dgui_quickstart_basics.html");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_text' ] = function(block) {
  const text_text = block.getFieldValue('text');
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `${value_name}${text_text}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'pattern_freemarker_linefeed' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField("\\n");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "String");
    this.setNextStatement(true, "String");
    this.setColour(45);
    this.setTooltip("Linefeed");
    this.setHelpUrl("https://freemarker.apache.org/docs/dgui_quickstart_basics.html");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_linefeed' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `${value_name}^`;
  return code;
};

Blockly.Blocks[ 'pattern_freemarker_if_exists' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput(""), "text")
      .appendField("??");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(15);
    this.setTooltip("if exists");
    this.setHelpUrl("https://freemarker.apache.org/docs/dgui_quickstart_basics.html");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_if_exists' ] = function(block) {
  const text_text = block.getFieldValue('text');
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `<#if ${text_text}??>${value_name}</#if>`.encodeXML();
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'pattern_freemarker_has_content' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput(""), "text")
      .appendField("?");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(0);
    this.setTooltip("has content");
    this.setHelpUrl("https://freemarker.apache.org/docs/dgui_quickstart_basics.html");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_has_content' ] = function(block) {
  const text_text = block.getFieldValue('text');
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `<#if ${text_text}?has_content>${value_name}</#if>`.encodeXML();
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'pattern_freemarker_concat' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField("+");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "String");
    this.setNextStatement(true, "String");
    this.setColour(60);
    this.setTooltip("Concatination");
    this.setHelpUrl("https://freemarker.apache.org/docs/dgui_quickstart_basics.html");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_concat' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `${value_name}`;
  return code;
};

Blockly.Blocks[ 'pattern_freemarker_space' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(75);
    this.setTooltip("Space");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_space' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `${value_name} `;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'pattern_freemarker_enter' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField("\\n");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(45);
    this.setTooltip("Linefeed");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript[ 'pattern_freemarker_enter' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  return [`${value_name}^`, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'xml_element' ] = {
  init: function() {
    this.appendValueInput("attr")
      .setCheck("String")
      .appendField(new Blockly.FieldDropdown([["A", "Active"], ["D", "Deactive"], ["C", "Comment"]]), "trans")
      .appendField(new Blockly.FieldTextInput("element"), "tag");
    this.appendStatementInput("childs")
      .setCheck("String");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "String");
    this.setNextStatement(true, "String");
    this.setColour(240);
    this.setTooltip("xml element tag");
    this.setHelpUrl("https://www.w3schools.com/xml/xml_dtd_el_vs_attr.asp");
  }
};

Blockly.JavaScript[ 'xml_element' ] = function(block) {
  const dropdown_trans = block.getFieldValue('trans');
  const text_tag = block.getFieldValue('tag');
  const value_attr = Blockly.JavaScript.valueToCode(block, 'attr', Blockly.JavaScript.ORDER_NONE);
  const statements_childs = Blockly.JavaScript.statementToCode(block, 'childs');
  // TODO: Assemble JavaScript into code variable.
  if (dropdown_trans === "Deactive") {
    return '';
  } else {
    let code = `<${text_tag} ${value_attr}`;
    if (statements_childs.length > 0) {
      code = code + '>' + statements_childs + `</${text_tag}>`;
    } else {
      code = code + '/>';
    }
    if (dropdown_trans === "Comment") {
      code = '<!--' + code + '-->';
    }
    return code;
  }
};

Blockly.Blocks['xml_attribute_string'] = {
  init: function() {
    this.appendValueInput("oth")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput("attribute"), "attr")
      .appendField(new Blockly.FieldTextInput("value"), "val");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(240);
    this.setTooltip("xml attribute");
    this.setHelpUrl("https://www.w3schools.com/xml/xml_dtd_el_vs_attr.asp");
  }
};

Blockly.JavaScript['xml_attribute_string'] = function(block) {
  const text_attr = block.getFieldValue('attr');
  const text_val = block.getFieldValue('val');
  const value_oth = Blockly.JavaScript.valueToCode(block, 'oth', Blockly.JavaScript.ORDER_NONE);
  const code = `${text_attr} = "${text_val}" ${value_oth}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['xml_attribute_number'] = {
  init: function() {
    this.appendValueInput("oth")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput("attribute"), "attr")
      .appendField(new Blockly.FieldNumber(0), "num");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(240);
    this.setTooltip("Number attribute");
    this.setHelpUrl("https://www.w3schools.com/xml/xml_dtd_el_vs_attr.asp");
  }
};

Blockly.JavaScript['xml_attribute_number'] = function(block) {
  const text_attr = block.getFieldValue('attr');
  const number_num = block.getFieldValue('num');
  const value_oth = Blockly.JavaScript.valueToCode(block, 'oth', Blockly.JavaScript.ORDER_NONE);
  const code = `${text_attr} = "${number_num}" ${value_oth}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['xml_attribute_boolean'] = {
  init: function() {
    this.appendValueInput("oth")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput("attribute"), "attr")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "bol");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(240);
    this.setTooltip("Boolean attribute");
    this.setHelpUrl("https://www.w3schools.com/xml/xml_dtd_el_vs_attr.asp");
  }
};

Blockly.JavaScript['xml_attribute_boolean'] = function(block) {
  const text_attr = block.getFieldValue('attr');
  const checkbox_bol = block.getFieldValue('bol') == 'TRUE';
  const value_oth = Blockly.JavaScript.valueToCode(block, 'oth', Blockly.JavaScript.ORDER_NONE);
  const code = `${text_attr} = "${checkbox_bol}" ${value_oth}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
