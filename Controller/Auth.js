const UserModel = require("../Models/user");
const Otp = require("../Models/otp"); 
const EmailNotification = require("../utils/EmailNotification");

const sendOtp = async (req, res) => {
    try {

        const { email, purpose } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: "Email is required. Please provide an email"
            });
        }

        const userEmail = email.toLowerCase();

        const existingUser = await UserModel.findOne({
            email: userEmail
        });

        // FORGOT PASSWORD / RESET PASSWORD
        if (
            purpose === "forgotPassword" ||
            purpose === "resetPassword"
        ) {

            // User must exist
            if (!existingUser) {
                return res.json({
                    success: false,
                    message: "Account not found"
                });
            }

        } 
        
        // REGISTER
        else {

            // User should not already exist
            if (existingUser) {
                return res.json({
                    success: false,
                    message: "Account already exists. Please login"
                });
            }
        }

        // Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        );

        // OTP expiry - 5 minutes
        const expiry = new Date(
            Date.now() + 5 * 60 * 1000
        );

        // Save OTP
        const updateOtp = await Otp.updateOne(
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

        if (!updateOtp.acknowledged) {
            return res.json({
                success: false,
                message: "Failed to save OTP. Please try again."
            });
        }

        // Email HTML
        const html = `
            <div style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;">

                <table width="100%" cellpadding="0" cellspacing="0"
                    style="padding:40px 15px;">

                    <tr>
                        <td align="center">

                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;">

                                <!-- Header -->
                                <tr>
                                    <td align="center"
                                        style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:35px 20px;">

                                        <h1 style="margin:0;color:#ffffff;font-size:28px;">
                                            NVKS Technovation
                                        </h1>

                                        <p style="margin-top:8px;color:#dbeafe;font-size:14px;">
                                            Learning Management System
                                        </p>

                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding:40px 30px;text-align:center;">

                                        <h2 style="margin:0;color:#111827;font-size:24px;">
                                            OTP Verification
                                        </h2>

                                        <p style="margin-top:15px;color:#4b5563;font-size:15px;">
                                            Use the verification code below to continue.
                                        </p>

                                        <!-- OTP -->
                                        <div style="
                                            margin:35px auto;
                                            background:#eff6ff;
                                            border:2px dashed #2563eb;
                                            border-radius:14px;
                                            padding:20px;
                                            max-width:280px;
                                        ">

                                            <div style="
                                                font-size:36px;
                                                font-weight:bold;
                                                letter-spacing:10px;
                                                color:#1d4ed8;
                                            ">
                                                ${otp}
                                            </div>

                                        </div>

                                        <p style="
                                            color:#ef4444;
                                            font-size:14px;
                                            font-weight:600;
                                        ">
                                            This OTP will expire in 5 minutes.
                                        </p>

                                        <p style="
                                            margin-top:25px;
                                            color:#6b7280;
                                            font-size:14px;
                                        ">
                                            If you didn't request this OTP,
                                            you can safely ignore this email.
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="
                                        background:#f9fafb;
                                        padding:22px;
                                        text-align:center;
                                    ">

                                        <p style="
                                            margin:0;
                                            color:#6b7280;
                                            font-size:13px;
                                        ">
                                            © 2026 SAN Technovation Pvt. Ltd.
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                </table>

            </div>
        `;

        // Send OTP Email
        const isMailSent = await EmailNotification({
            receiverEmail: userEmail,
            subject: "OTP Verification",
            dynamicHtml: html
        });

        if (!isMailSent) {
            return res.json({
                success: false,
                message: "Failed to send OTP to mail. Please contact support team."
            });
        }

        return res.json({
            success: true,
            message: "OTP sent successfully!"
        });

    } catch (err) {

        console.log("Error in send OTP:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




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



const forgotPassword = async (req, res) => {
    try {

        const { email, otp, newPassword, confirmPassword} = req.body;
        

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






const verifyOTP = async (req, res) => { 
    try { 
        const { name, email, enteredOTP, password, contact, age, gender, address, city, state } = req.body; 
 
        if (!name || !email || !password || !enteredOTP || !contact || !age || !gender || !address || !city || !state) { 
            return res.json({ success: false, message: "All fields are required" }); 
        } 

        const otpData = await Otp.findOne({ email }); 
        if (!otpData) { 
            return res.json({ success: false, message: "Email not found" }); 
        } 
        

 
        if (Number(otpData.otp) !== Number(enteredOTP)) { 
            return res.json({ success: false, message: "Invalid Email" }); 
        } 

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }
 
        const saveUser = await Users.create({ name, email, password, contact, age, gender, address, city, state }); 

        return res.json({ success: true, message: "OTP verification success", saveUser}); 
 
    } catch (err) { 
        console.log("VERIFY OTP ERROR:", err); 
        return res.json({ 
            success: false, 
            message: "Server error", 
            error: err.message 
        }); 
    } 
}; 

module.exports = { sendOtp,resetPassword ,forgotPassword ,verifyOTP };