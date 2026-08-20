const express = require("express");
const {sendOtp}  = require("../Controller/Auth");

const router = express.Router();

router.post("/send-otp",sendOtp);

module.exports = router;