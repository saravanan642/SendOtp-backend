const Otp = require("../Models/otp");

const verifyOTP = async (req, res) => {
    try {
        const { email, enteredOTP } = req.body;

        const otpData = await Otp.findOne({ email });

        if (!otpData) {
            return res.json({
                success: false,
                message: "OTP not found"
            });
        }

        if (Number(otpData.otp) !== Number(enteredOTP)) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        return res.json({
            success: true,
            message: "OTP verification success"
        });

    } catch (err) {
        console.log(err.message);

        return res.json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    verifyOTP
};