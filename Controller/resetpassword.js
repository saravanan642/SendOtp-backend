const User = require("../Models/user");
const Otp = require("../Models/otp");

const resetPassword = async (req, res) => {
    try {

        const {
            email,
            otp,
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        
        if (!email || !otp || !currentPassword || !newPassword || !confirmPassword) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const userEmail = email.trim().toLowerCase();

      
        const otpData = await Otp.findOne({
            email: userEmail
        });

        console.log("OTP from DB:", otpData);

        if (!otpData) { return res.json({ success: false, message: "OTP not found" });
        }

       
        if (new Date() > otpData.expiresAt) {
             await Otp.deleteOne({
                email: userEmail
            });

            return res.json({ success: false, message: "OTP expired" });
        }

        
        if (String(otpData.otp) !== String(otp)) {
            return res.json({ success: false,  message: "Invalid OTP" });
        }

       
        if (newPassword !== confirmPassword) {
            return res.json({ success: false,  message: "Password does not match" });
        }

        const user = await User.findOne({
            email: {
                $regex: `^${userEmail}$`,
                $options: "i"
            }
        });

        console.log("User from DB:", user);

        if (!user) {
            return res.json({ success: false, message: "User not found"});
        }

        if (user.password !== currentPassword) {
            return res.json({ success: false, message: "Old password is incorrect" });
        }

        // 8. Set New Password
        user.password = newPassword;

        // 9. Save to Database
        await user.save();

        // 10. Delete OTP after successful password change
        await Otp.deleteOne({
            email: userEmail
        });

        return res.json({ success: true, message: "Password changed successfully"  });

    } catch (error) {

        console.log("RESET PASSWORD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = resetPassword;