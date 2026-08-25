const express = require("express");

const { sendOtp } = require("../Controller/Auth");
const { verifyOTP } = require("../Controller/verifyotp");
const forgotPassword = require("../Controller/forgetpassword");
const  resetPassword  = require("../Controller/resetpassword")


const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOTP);

router.post("/forget-password", forgotPassword);

router.post("/reset-password", resetPassword )

module.exports = router;