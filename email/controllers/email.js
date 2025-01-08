import nodemailer from 'nodemailer';

/**
 * Sends an evaluation form email to a student.
 * @param email - The email address to send to.
 * @returns A message indicating the result of the email sending process.
 */
export const sendEmail =  async (req, res) =>{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Receipt for your transaction",
            html: `
                <p>Thank you for your transaction! Here are the details:</p>
                <ul>
                    <li><strong>Transaction type:</strong> Add money to wallet</li>
                    <li><strong>Amount:</strong> $50.00</li>
                    <li><strong>Date:</strong> 2024-12-30</li>
                </ul>
                <p>Best regards,<br>SSA Team</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.messageId}`);
        res.status(200).json({ success: true, message: `Message sent: ${info.messageId}` });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const sendCertificate =  async (req, res) =>{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Delivery of your ownership certificate",
            html: `
                <p>Good news, you are now officially the proud owner of shares of the following property : ${req.body.property}.</p>
                <p>Here are the details:</p>
                <ul>
                    <li><strong>Property:</strong> ${req.body.property}</li>
                    <li><strong>Shares:</strong> ${req.body.shares}</li>
                    <li><strong>Date:</strong> ${req.body.date}</li>
                </ul>
                <p>Best regards,<br>SSA Team</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.messageId}`);
        res.status(200).json({ success: true, message: `Message sent: ${info.messageId}` });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}