const Otp = require("../Models/otp");

const verifyOTP = async (req, res) => {
    try {

        

    } catch (err) {
        console.log(err.message);

        return res.json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { verifyOTP };