import { UserModel } from "../models/usersModel.js";
import nodemailer from "nodemailer"


const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
}

export const resetPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        // check if user exists in the database
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // igenerate and save OTP
        const otp = generateOTP()
        user.resetToken = otp;
        await user.save()

        console.log("Email User", process.env.EMAIL_USER);
        console.log("Email Pass", process.env.EMAIL_PASS);

        // send otp via email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_HOST,
            to: user.email,
            subject: "Reset Password",
            text: `Please use the following OTP to complete the process of resetting your password:\n\n${otp}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        }

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.log("Error processing password reset:", error);
        next(error);
    }
}