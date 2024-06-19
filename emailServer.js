require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 2000;

app.use(bodyParser.json());
const corsOptions = {
    origin: ['https://lontokkayo.github.io', 'http://localhost:19006', 'https://control-rmj.web.app/'], // Allow only this origin to make requests
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Replace the OAuth2 client setup with SMTP setup using App Password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your App Password
    }
});

async function sendMail(to, subject, htmlContent) {
    const mailOptions = {
        from: `"Real Motor Japan" <${process.env.EMAIL_ADDRESS}>`, // Sender name and email
        replyTo: "info@realmotor.jp",
        to: to,
        subject: subject,
        html: htmlContent,
    };

    // No need to get an access token, just send the mail
    return transporter.sendMail(mailOptions);
}

app.post('/send-email', async (req, res) => {
    try {
        await sendMail(req.body.to, req.body.subject, req.body.htmlContent);
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email');
    }
});


async function sendMailNotif(toList, subject, htmlContent) {
    const mailOptions = {
        from: `"Real Motor Japan Auto-Mail" <info@realmotor.jp>`, // Sender name and email
        replyTo: "info@realmotor.jp",
        to: toList.join(','), // Join the array of email addresses into a comma-separated string
        subject: subject,
        html: htmlContent,
    };
    // No need to get an access token, just send the mail
    return transporter.sendMail(mailOptions);
}

app.post('/send-email-notif', async (req, res) => {
    try {
        const { to, subject, htmlContent } = req.body;

        // Ensure `to` is an array
        if (!Array.isArray(to)) {
            throw new Error('The "to" field must be an array of email addresses');
        }

        await sendMailNotif(to, subject, htmlContent);
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email');
    }
});

app.listen(port, () => {
    console.log(`Email server is running on port ${port}.`);
});

