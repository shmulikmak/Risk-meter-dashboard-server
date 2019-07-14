const Transport = require('winston-transport');
const { sendMail } = require('../mailer');

/**
 * Mail Transport
 */
module.exports = class MailTransport extends Transport {
    constructor(opts) {
        super(opts);
        this.mailOptions = {
            from: opts.from,
            to: opts.to,
            subject: opts.subject,
            html: ''
        };
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        this.mailOptions.html = this.getMailHtml(info);

        sendMail(this.mailOptions)
            .then(() => {
                callback();
            })
            .catch(err => {
                callback();
                console.error(err);
            });
    }

    getMailHtml(info) {
        return `
        <div style="direction: ltr; white-space: pre; font-size: 20px; color: red;">
            ${info[Symbol.for('message')]}
        </div>`;
    }
};
