const type = "DATA_SOURCE";

function JsonObject() {
    this.type = type.toLowerCase();
    this.dataSources = {};
}

export default JsonObject;