const express = require("express");

const { sendOtp } = require("../Controller/Auth");
const { verifyOTP } = require("../Controller/verifyotp");

const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOTP);

module.exports = router;