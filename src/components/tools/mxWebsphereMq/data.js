const type  = "WEBSPHEREMQ";

function Config() {
  this.mode = null;
  this.ip = null;
  this.port = null;
  this.qm = null;
  this.qName = null;
  this.user = null;
  this.pass = null;
  this.channelName = null;
  this.instance = null;
  this.codepage = null;
  this.readAhead = null;
}

function Setting() {this.count= 1;}

function JsonObject() {
  this.type = type.toLowerCase();
  this.config = new Config();
  this.setting = new Setting();
}

export default JsonObject;