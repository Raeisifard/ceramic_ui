//Add necessary codecs
function VueComponent() {

}

//VueComponent.prototype.name = "VueComponent";
mxCodecRegistry.addAlias(mxUtils.getFunctionName(VueComponent), 'VueComponent');
window[ "VueComponent" ] = VueComponent;

let codec = new mxObjectCodec(new VueComponent());
codec.exclude.push('VueComponent');
codec.encode = function(enc, obj) {
  let node = enc.document.createElement('VueComponent');
  node.setAttribute("name", obj.$options.name);
  return node;
};

codec.decode = function(dec, node, into) {
  let cell = dec.objects[ node.parentNode.getAttribute("id") ];
  /*if(cell.getType() === 'chart'){
    let state = graph.view.getState(cell);
    state.style[ mxConstants.STYLE_FILLCOLOR ] = cell.getData().config.fillColor;
    state.shape.apply(state);
    state.shape.redraw();
  }*/
  return store.getters.getVueComponentByObject({ $store: store }, cell);
};
mxCodecRegistry.register(codec);

function JsonObject() {
  this.type = null;
  this.config = new function Config() {
  };
  this.setting = new function Setting() {
  };
}

//JsonObject.prototype.name = "JsonObject";
mxCodecRegistry.addAlias(mxUtils.getFunctionName(JsonObject), 'JsonObject');
window[ "JsonObject" ] = JsonObject;
codec = new mxObjectCodec(new JsonObject());
codec.encode = function(enc, obj) {
  let node = enc.document.createElement('JsonObject');
  mxUtils.setTextContent(node, JSON.stringify(obj));
  return node;
};

codec.decode = function(dec, node, into) {
  let obj = JSON.parse(mxUtils.getTextContent(node));
  obj.constructor = JsonObject;

  return obj;
};
mxCodecRegistry.register(codec);

let mxObjectCodecOld = mxObjectCodec.prototype.decodeNode;
mxObjectCodec.prototype.decodeNode = function(dec, node, obj) {
  if (node != null) {
    if (node.getAttribute('id') != null && node.getAttribute('vertex') === '1') {
      let ref = node.getAttribute('id');
      let vertx = dec.objects[ ref ] || dec.lookup(ref);
      if (vertx != null && vertx.isVertex())
        return;
    }
    mxObjectCodecOld.apply(this, [dec, node, obj]);
  }
};

mxText.prototype.apply = function(state)
{
  var old = this.spacing;
  mxShape.prototype.apply.apply(this, arguments);

  if (this.style != null)
  {
    this.fontStyle = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, this.fontStyle);
    this.family = mxUtils.getValue(this.style, mxConstants.STYLE_FONTFAMILY, this.family);
    this.size = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, this.size);
    this.color = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, this.color);
    this.align = mxUtils.getValue(this.style, mxConstants.STYLE_ALIGN, this.align);
    this.valign = mxUtils.getValue(this.style, mxConstants.STYLE_VERTICAL_ALIGN, this.valign);
    this.poslabel = mxUtils.getValue(this.style, mxConstants.STYLE_LABEL_POSITION, this.poslabel || this.align);
    this.vposlabel = mxUtils.getValue(this.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, this.vposlabel || this.valign);
    this.spacing = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING, this.spacing));
    this.spacingTop = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_TOP, this.spacingTop - old)) + this.spacing;
    this.spacingRight = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_RIGHT, this.spacingRight - old)) + this.spacing;
    this.spacingBottom = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_BOTTOM, this.spacingBottom - old)) + this.spacing;
    this.spacingLeft = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_LEFT, this.spacingLeft - old)) + this.spacing;
    this.horizontal = mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, this.horizontal);
    this.background = mxUtils.getValue(this.style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, this.background);
    this.border = mxUtils.getValue(this.style, mxConstants.STYLE_LABEL_BORDERCOLOR, this.border);
    this.textDirection = mxUtils.getValue(this.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION);
    this.opacity = mxUtils.getValue(this.style, mxConstants.STYLE_TEXT_OPACITY, 100);
    this.updateMargin();
  }

  this.flipV = null;
  this.flipH = null;
};
