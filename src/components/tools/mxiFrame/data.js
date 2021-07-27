const type = "IFRAME";

function Config() {
  this.label = '<iframe srcdoc="<p>Hello world!</p>" src="demo_iframe_srcdoc.htm" width="300" height="195" style="border:1px solid black;background-color: coral;"></iframe>';
  this.fillColor = 'rgb(24,255,150,0.65)';
  this.style = {};
  this.style['STYLE_VERTICAL_ALIGN'] = 'ALIGN_TOP';
  this.style['STYLE_ALIGN'] = 'ALIGN_RIGHT';
}

function Setting() {

}

function JsonObject() {
  this.type = type.toLowerCase();
  this.config = new Config();
  this.setting = new Setting();
}

export default JsonObject;