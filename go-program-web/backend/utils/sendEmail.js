const nodemailer = require('nodemailer');
const {RESET_PASSWORD} = require('./emailTypes');

module.exports = (to, type, content, successcb, failurecb) =>{
    var text, subject;
    switch(type){
        case RESET_PASSWORD:
            console.log("Inside case");
            text = `Your new password is ${content}. Please don't forget to change your password as soon as possible.`;
            subject = `Go Program Password Reset`;
            break;
        default:
            break;
    }
    const mailOptions = {
        from: 'no-reply-go-program@sjsu.edu',
        to: to.isArray()?to.join(","):to,
        subject,
        text
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "engineering-smtp-service@sjsu.edu",
            pass: "thatcould"
        },
    });
    transporter.sendMail(mailOptions, function (err,info) {
        if(err)
        {
            failurecb(err);
            return;
        }
        successcb(info);
    });
}