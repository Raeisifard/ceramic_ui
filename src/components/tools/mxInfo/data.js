const type = "INFO";

function Config() {
  this.info = '<h1 style="margin:0;">Info & Doc</h1>' +
    '<img src="/src/images/icons48/info.png" width="48" height="48">' +
    '<br>' +
    '<a href="http://www.jgraph.com" target="_blank">Edit</a>';
  this.fillColor = 'rgb(224,255,150,0.65)';
}

function Setting() {

}

function JsonObject() {
  this.type = type.toLowerCase();
  this.config = new Config();
  this.setting = new Setting();
}

export default JsonObject;