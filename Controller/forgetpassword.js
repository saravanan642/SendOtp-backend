const User = require("../Models/user");
const Otp = require("../Models/otp");

const forgotPassword = async (req, res) => {
    try {

        const {
            email,
            otp,
            newPassword,
            confirmPassword
        } = req.body;
        

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const userEmail = email.trim().toLowerCase();



        // OTP check
        const otpData = await Otp.findOne({
            email: userEmail
        });

        console.log("OTP from DB:", otpData);

        if (!otpData) {
            return res.json({
                success: false,
                message: "OTP not found"
            });
        }

        if (String(otpData.otp) !== String(otp)) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Password check
        if (newPassword !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password does not match"
            });
        }

        // Find user
        const user = await User.findOne({
            email: {
                $regex: `^${userEmail}$`,
                $options: "i"
            }
        });

        console.log("Searching email:", userEmail);
        console.log("User from DB:", user);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Update password
        user.password = newPassword;

        await user.save();

        // Delete otp  
        await Otp.deleteOne({
            email: userEmail
        });

        return res.json({ success: true, message: "Password changed successfully"});

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = forgotPassword;