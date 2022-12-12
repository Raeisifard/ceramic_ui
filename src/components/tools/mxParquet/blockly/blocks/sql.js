import * as Blockly from 'blockly/core';

if (!String.prototype.encodeXML) {
  String.prototype.encodeXML = function() {
    return this.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
}
Blockly.Blocks[ 'sql_freemarker_interpolate' ] = {
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

Blockly.JavaScript[ 'sql_freemarker_interpolate' ] = function(block) {
  const text_field = block.getFieldValue('FIELD');
  const value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `\${${text_field}}${value_input}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_freemarker_text' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput(""), "text");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(330);
    this.setTooltip("fix text");
    this.setHelpUrl("https://freemarker.apache.org/docs/dgui_quickstart_basics.html");
  }
};

Blockly.JavaScript[ 'sql_freemarker_text' ] = function(block) {
  const text_text = block.getFieldValue('text');
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `${text_text}${value_name}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_freemarker_if_exists' ] = {
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

Blockly.JavaScript[ 'sql_freemarker_if_exists' ] = function(block) {
  const text_text = block.getFieldValue('text');
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  const code = `<#if ${text_text}??>`.encodeXML() + `${value_name}` + "</#if>".encodeXML();
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_freemarker_else' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck(null)
      .appendField("else");
    this.setOutput(true, "String");
    this.setColour(0);
    this.setTooltip("if else");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript[ 'sql_freemarker_else' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  const code = "<#else>".encodeXML() + `${value_name}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_freemarker_has_content' ] = {
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

Blockly.JavaScript[ 'sql_freemarker_has_content' ] = function(block) {
  const text_text = block.getFieldValue('text');
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  const code = `<#if ${text_text}?has_content>`.encodeXML() + `${value_name}` + "</#if>".encodeXML();
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_freemarker_concat' ] = {
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

Blockly.JavaScript[ 'sql_freemarker_concat' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = `${value_name}`;
  return code;
};

Blockly.Blocks[ 'sql_freemarker_space' ] = {
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

Blockly.JavaScript[ 'sql_freemarker_space' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  // TODO: Assemble JavaScript into code variable.
  const code = ` ${value_name}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_freemarker_enter' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField("\\n");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(240);
    this.setTooltip("Carriage return");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript[ 'sql_freemarker_enter' ] = function(block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  return [`\r\n${value_name}`, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_freemarker_linefeed' ] = {
  init: function() {
    this.appendDummyInput()
      .appendField("\\n");
    this.setOutput(true, "String");
    this.setColour(240);
    this.setTooltip("Linefeed");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript[ 'sql_freemarker_linefeed' ] = function(block) {
  return [`\r\n`, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks[ 'sql_interpolate_statement' ] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField(new Blockly.FieldTextInput(""), "pre")
      .appendField("${")
      .appendField(new Blockly.FieldTextInput(""), "interpolate")
      .appendField("}")
      .appendField(new Blockly.FieldTextInput(""), "post");
    this.setOutput(true, "String");
    this.setColour(230);
    this.setTooltip("statement with interpolate");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript[ 'sql_interpolate_statement' ] = function(block) {
  const text_pre = block.getFieldValue('pre');
  const text_interpolate = block.getFieldValue('interpolate');
  const text_post = block.getFieldValue('post');
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
  const code = `${text_pre}\${${text_interpolate}}${text_post}${value_name}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};