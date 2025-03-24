const NodeCache = require("node-cache");
const myCache = new NodeCache();
const tokenKey = "token";
const rtuKey = "rtu";
const loginKey = "login";
const enableAutoSendFile = "autoSendFile";
const fileSendToMechis = "fileSend";
module.exports = {
  myCache,
  tokenKey,
  rtuKey,
  loginKey,
  enableAutoSendFile,
  fileSendToMechis,
};
