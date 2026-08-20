const OtpModel = require("../Models/Otp");
const UserModel = require("../Models/User");

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        

    } catch (err) {
        console.log("Error in the send OTP",err);
        return res.josn({success: false, message: " Internal server error"})
    }
};
module.exports ={sendOtp};