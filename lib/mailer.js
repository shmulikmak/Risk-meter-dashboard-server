const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transport
const transporter = nodemailer.createTransport({
    service: config.mailer.service,
    logger: false,
    auth: config.mailer.auth
});

/**
 * Send mail
 *
 * @param {{ from?: string, to: string, subject: string, html: string }} config Mail config
 * @returns {Promise<any>} The mail result
 */
function sendMail({ from, to, subject, html }) {
    if (!to) {
        return Promise.reject(new Error('"to" field missing from mail option'));
    }

    const mailOptions = {
        from: config.mailer.from || from,
        to,
        subject,
        html
    };

    // send mail
    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail
};
