const { myCache, rtuKey, tokenKey } = require("../constants/cache");
const {
  baseUrl,
  baseUrlStage,
} = require("../environment/environment.development");
const { rtuAuthentication } = require("../constants/rtu_authen");
const axiosInstance = require("../middlewares/axiosInstance");
const jsonFile = require("../upload/RTU-JSON-Data-Strucutre.json");
const cron = require("node-cron");
const { settings } = require("../constants/global_variable");
const db = require("../models");
const Logs = db.logs;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getMechisToken(secretKey, appKey, reference, url) {
  try {
    // const { secretKey, appKey, reference } = rtuAuthentication;
    const token = myCache.get(tokenKey);
    if (token) return token;
    const rtu = myCache.get(rtuKey);
    var response = null;
    response = await axiosInstance.post(
      `${rtu ? rtu.url : url}account/RtuV1/Login`,
      {
        secretKey: secretKey,
        appKey: appKey,
        reference: reference,
      }
    );
    if (response.data.errorCode === 417) {
      console.log("Login information is incorrect");
      return;
    }
    if (response.data.success) {
      myCache.set(tokenKey, response.data.content.token);
      return response.data.content.token;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getSettings(secretKey, appKey, reference, url) {
  try {
    const token = await getMechisToken(secretKey, appKey, reference, url);
    var response = null;
    if (token) {
      const rtu = myCache.get(rtuKey);
      if (url) {
        var base = null;
        if (url.endsWith("/")) {
          base = url;
        } else {
          base = url + "/";
        }
        response = await axiosInstance.get(`${url}rtu/RtuV1/GetSetting`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (rtu) {
        var base = null;
        if (rtu.url.endsWith("/")) {
          base = rtu.url;
        } else {
          base = rtu.url + "/";
        }
        response = await axiosInstance.get(`${rtu.url}rtu/RtuV1/GetSetting`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        var base = null;
        if (baseUrl.endsWith("/")) {
          base = baseUrl;
        } else {
          base = baseUrl + "/";
        }
        response = await axiosInstance.get(`${baseUrl}rtu/RtuV1/GetSetting`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }
    if (response.status === 200) {
      settings.rtuSetting = response.data;
      myCache.set(rtuKey, response.data);
    } else if (response.status === 401) {
      await Logs.create({
        description: "token expired",
        logType: "TokenExpired",
        rtuId: myCache.get(rtuKey).id,
      });
      myCache.del(tokenKey);
      getSettings(secretKey, appKey, reference);
    } else {
      console.log(response.error);
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendJsonFileToMechis(secretKey, appKey, reference, file) {
  try {
    const token = await getMechisToken(secretKey, appKey, reference);
    var response = null;
    if (token) {
      const rtu = myCache.get(rtuKey);
      response = await axiosInstance.post(
        `${rtu ? rtu.url : baseUrl}rtu/RtuV1/JSONReceive`,
        {
          ...file,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
    if (response.status === 200) {
      console.log("sent Successfully");
      await Logs.create({
        description: "send file",
        logType: "SendJson",
        rtuId: myCache.get(rtuKey).id,
      });
      return;
    } else if (response.status === 401) {
      await Logs.create({
        description: "token expired",
        logType: "TokenExpired",
        rtuId: myCache.get(rtuKey).id,
      });
      myCache.del(tokenKey);
      sendJsonFileToMechis(secretKey, appKey, reference, file);
    } else {
      await Logs.create({
        description: "token expired",
        logType: "TokenExpired",
        rtuId: myCache.get(rtuKey).id,
      });
      myCache.del(tokenKey);
      sendJsonFileToMechis(secretKey, appKey, reference, file);
    }
  } catch (error) {
    console.log(error);
  }
}

async function readFileFromUrl(secretKey, appKey, reference, fileUrl) {
  console.log("File URL: ", fileUrl);

  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const contentType = response.headers.get("content-type");
      if (contentType.includes("application/json")) {
        return response.json(); // Parse JSON if content type is JSON
      } else if (
        contentType.includes("application/xml") ||
        contentType.includes("text/xml")
      ) {
        return response.text(); // Parse XML if content type is XML
      } else {
        throw new Error(`Unsupported content type: ${contentType}`);
      }
    })
    .then((data) => {
      sendJsonFileToMechis(secretKey, appKey, reference, data);
    })
    .catch((error) => {
      console.error("Error fetching file:", error);
    });
}

module.exports = {
  getMechisToken,
  getSettings,
  sendJsonFileToMechis,
  readFileFromUrl,
};
