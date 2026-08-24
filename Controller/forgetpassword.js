
const OtpSchema = require("../Models/otp"); 
const sendEmail = require("../utils/EmailNotification"); 
 
const forgotPassword = async (req, res) => { 
    try { 
        const otpverify = await otp.findOne({email, otp, newPassword, confirmpassword });

        if(!email || !otp || !newPassword || !confoirmpassword ){

        }
       


     

        const user = await Users.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Email not found"
            });
        }

        user.password = newPassword;

        await user.save();

        return res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) { 

        console.log("FORGOT PASSWORD ERROR:", err); 
 
        return res.json({ 
            success: false, 
            message: "Server error", 
            error: err.message 
        }); 
    } 
}; 
 
module.exports = { forgotPassword };