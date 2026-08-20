const OtpModel = require("../Models/Otp");
const UserModel = require("../Models/User");

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: " Email is require. Please an emaik" });
        }
        const userEmail = email.toLowerCase();

        const existingUser = await UserModel.findOne({
            email: userEmail
        });

        if (!existingUser) {
            return res.json({ success: false, message: " Account already exists. Please login" });
        }

        const OtpModel = Math.floor(100000 + Math.random() * 900000);

        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        const updateotp = await OtpModel.updateOne(
            {
                email: userEmail
            },
            {
                $set: {
                    otp: otp,
                    expiresAt: expiry
                }
            },
            {
                upsert: true
            }
        );

        if(!updateotp){
            return res.josn({ success: false, message: "Failed to save OTP. Please try again." })
        }




    } catch (err) {
        console.log("Error in the send OTP", err);
        return res.josn({ success: false, message: " Internal server error" })
    }
};
module.exports = { sendOtp };