const express = require("express");
const os = require("os");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/file");
const settingRoutes = require("./routes/settings");
const authApiRoutes = require("./routes/api/auth_api.js");
const fileApiRoutes = require("./routes/api/file_api.js");
const logApiRoutes = require("./routes/api/log_api.js");
const settingApiRoutes = require("./routes/api/setting_api.js");
const dashboardRoutes = require("./routes/dashboard");
const logRoutes = require("./routes/log");
const { PORT, IP_ADDRESS } = require("./constants/base_url.js");
const {
  getSettings,
  getMechisToken,
  sendJsonJob,
  sendJsonFileToMechis,
  readFileFromUrl,
} = require("./init/init.js");
const { settings } = require("./constants/global_variable.js");
const passport = require("passport");
const path = require("path");
const cors = require("cors");
const toastr = require("express-toastr");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const db = require("./models");
const Status = db.status;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.static("environment"));
app.use(express.static("css"));
app.use(express.static("upload"));
app.use(express.static(path.join(__dirname, "public")));
// Body parser middleware for handling JSON data
app.use(bodyParser.json());
// Set up connect-flash middleware
const cron = require("node-cron");
const {
  myCache,
  rtuKey,
  tokenKey,
  enableAutoSendFile,
} = require("./constants/cache.js");
const { init: initAuth } = require("./auth");
const { count } = require("console");

app.use(flash());

// Set up express-toastr middleware
app.use(
  toastr({
    closeButton: true,
    progressBar: true,
  })
);
app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: "woot",
    resave: false,
    saveUninitialized: false,
  })
);

initAuth();
// Initialize Passport and restore authentication state if available
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  // getMechisToken();
  // if (!myCache.get(tokenKey)) await getSettings();
  res.locals.toastr = req.toastr.render();
  next();
});

cron.schedule("* * * * * *", async () => {
  settings.count++;
  const rtuData = myCache.get(rtuKey);
  if (rtuData) {
    const status = await Status.findOne({
      where: { rtuId: rtuData.id },
    });
    if (status != null) {
      if (settings.count >= rtuData.interval) {
        // console.log("reach");
        const statusVal = status.dataValues;
        if (statusVal.enableSendFile === 1) {
          if (statusVal.fileToSend) {
            await readFileFromUrl(
              rtuData.secretKey,
              rtuData.appKey,
              rtuData.reference,
              statusVal.fileToSend
            );
            // await sendJsonFileToMechis(
            //   rtuData.secretKey,
            //   rtuData.appKey,
            //   rtuData.reference,
            //   statusVal.fileToSend
            // );
          }
        }
        settings.count = 0;
      }
    }
  }
});
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", logRoutes);
app.use("/", fileRoutes);
app.use("/", settingRoutes);
app.use("/api", authApiRoutes);
app.use("/api", fileApiRoutes);
app.use("/api", logApiRoutes);
app.use("/api", settingApiRoutes);

// Function to get the current local network IP
// const getLocalIP = () => {
//   const interfaces = os.networkInterfaces();
//   const wifi = interfaces["Wi-Fi"];
//   let ipAddress = null;
//   wifi.forEach((element) => {
//     if (element["family"] == "IPv4" && !element["internal"]) {
//       ipAddress = element["address"];
//     }
//   });

//   return ipAddress ?? "127.0.0.1"; // Fallback to localhost if no network IP found
// };

const port = PORT || 3001;
const ip_address = IP_ADDRESS || "0.0.0.0"; // Your IP address
// db.sync({ force: false }).then(() => {
app.listen(port, ip_address, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// });
