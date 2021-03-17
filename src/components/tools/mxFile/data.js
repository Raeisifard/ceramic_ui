const type  = "FILE";

function Config() {

}

function Setting() {
  this.mode = "select";
  this.filePath = "";
  this.fileNameMask = "";
  this.fileNameDoneExt = "done";
  this.fileNameLockExt = "$";
}

function JsonObject() {
  this.type = type.toLowerCase();
  this.config = new Config();
  this.setting = new Setting();
}

export default JsonObject;