const Otp = require("../Models/otp"); 
const Users = require("../Models/user"); 
 
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
 
module.exports = { verifyOTP };