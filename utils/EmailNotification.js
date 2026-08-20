const nodemailer = require("nodemailer");

const EmailNotification = async ({
    receiverEmail,
    subject,
    dynamicHtml
}) => {

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
               user: "saravanansenthil605@gmail.com",
                pass: "ofof ulkb boyy aopn"
            }
        });

        const mailOptions = {
            from: `"NVKSS" <saravanansenthil605@gmail.com>`,
            to: receiverEmail,
            subject: subject,
            html: `
                <div style="font-family:Arial,sans-serif;padding:20px;">
                    ${dynamicHtml}
                </div>
            `
        };

        const response = await transporter.sendMail(mailOptions);

        console.log(
            "Email sent successfully:",
            response.messageId
        );

        return true;

    } catch (err) {

        console.log("Error Sending Email:", err);

        return false;
    }
};

module.exports = EmailNotification;