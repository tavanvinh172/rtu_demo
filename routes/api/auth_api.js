// Login user
const db = require("../../models");
const bcrypt = require("bcryptjs");
const express = require("express");
const authApi = require("../../controllers/api/auth_api_controller");
const User = db.user;

const router = express.Router();

router.post("/loginUser", authApi.loginApi);

router.get("/ping", authApi.pingRtuApi);

module.exports = router;
