const nodemailer = require('nodemailer');
const senderEmail = "engineering-smtp-service@sjsu.edu";
const senderPassword = "thatcould"; // gmail app password
module.exports = {
    sendMail: async (subject, text, to = defaultMailingList, successcb, failurecb) => {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.example.com',
            port: 587,
            secure: false, //secure:false for port 587
            auth: {
            user: senderEmail,
            pass: senderPassword,
            },
        });

        const message = {
            from: `SJSU GO Program <${"noreply-goprogram-sjsu@gmail.com"}>`,
            to,
            subject,
            text: subject,
            html: text,
        };

        transporter.sendMail(message, function (err,info) {
            if(err)
            {
                failurecb(err);
                return;
            }
            successcb(info);
        }); 
    },
};