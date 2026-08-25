const OtpModel = require("../Models/Otp");
const UserModel = require("../Models/User");
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
        const updateOtp = await OtpModel.updateOne(
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

module.exports = { sendOtp };