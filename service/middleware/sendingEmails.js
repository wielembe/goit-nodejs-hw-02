const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

const sendingEmails = async (email, verificationToken) => {
    const messageData = {
        from: "goitnoreply@gmail.pl",
        to: email,
        subject: "Email Verification",
        html: `<strong>Hello!</strong><br/>
    Please, verify your account.<br/><br/>
    Click the verification link:<br/>
    <a href="http://localhost:3000/api/users/verify/${verificationToken}">VERIFICATION LINK</a>`,
    };

    await client.messages
        .create(MAILGUN_DOMAIN, messageData)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = sendingEmails;
