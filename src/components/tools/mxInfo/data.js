const type = "INFO";

function Config() {
  this.info = '<img src="/src/images/icons48/info.png" width="48" height="48">' +
    '<h1 style="margin:0;">Info & Doc</h1>';
  /*'<a href="http://www.jgraph.com" target="_blank">Edit</a>';*/
  this.fillColor = 'rgb(24,255,150,0.65)';
  this.style = {};
  this.style[ 'STYLE_VERTICAL_ALIGN' ] = 'ALIGN_TOP';
  this.style[ 'STYLE_ALIGN' ] = 'ALIGN_RIGHT';
}

function Setting() {

}

function JsonObject() {
  this.type = type.toLowerCase();
  this.config = new Config();
  this.setting = new Setting();
}

export default JsonObject;