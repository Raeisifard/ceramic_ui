const dataSourceTypes = {};
const freeType = {}
const ibmWebsphereMq = {
    ip: "172.0.0.1",
    port: 1414,
    qm: "my.Queue.Manager",
    qName: "TestQueue",
    channelName: "SYSTEM.DEF.SVRCONN",
    user: "me",
    pass: "123"
};
const msSqlServer = {
    ip: "127.0.0.1",
    port: 1433,
    dbName: "myDB",
    user: "sa",
    pass: "123"
};
const watchFolder = {
  filePath: "",
  fileNameMask: "",
  fileNameDoneExt: "done",
  fileNameLockExt: "$"
};
dataSourceTypes[ "Free Type" ] = freeType;
dataSourceTypes[ "IBM Websphere MQ" ] = ibmWebsphereMq;
dataSourceTypes[ "MS SQL Server" ] = msSqlServer;
dataSourceTypes[ "Watch Folder" ] = watchFolder;

export default dataSourceTypes;