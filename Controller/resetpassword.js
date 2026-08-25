const User = require("../Models/user");
const Otp = require("../Models/otp");

const resetPassword = async (req, res) => {
    try {

        const {
            email,
            otp,
            oldPassword,
            newPassword,
            confirmPassword
        } = req.body;

        // 1. All fields check
        if (!email || !otp || !oldPassword || !newPassword || !confirmPassword) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const userEmail = email.trim().toLowerCase();

        // 2. Check OTP + Email
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

        // 3. Check OTP expiry
        if (new Date() > otpData.expiresAt) {
            await Otp.deleteOne({
                email: userEmail
            });

            return res.json({
                success: false,
                message: "OTP expired"
            });
        }

        // 4. Check OTP match
        if (String(otpData.otp) !== String(otp)) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // 5. Check new password and confirm password
        if (newPassword !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password does not match"
            });
        }

        // 6. Find User by Email
        const user = await User.findOne({
            email: {
                $regex: `^${userEmail}$`,
                $options: "i"
            }
        });

        console.log("User from DB:", user);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // 7. Check Old Password
        if (user.password !== oldPassword) {
            return res.json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // 8. Set New Password
        user.password = newPassword;

        // 9. Save to Database
        await user.save();

        // 10. Delete OTP after successful password change
        await Otp.deleteOne({
            email: userEmail
        });

        return res.json({
            success: true,
            message: "Password changed successfully"
        });

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