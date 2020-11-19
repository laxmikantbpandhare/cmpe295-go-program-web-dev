const sendmail = require('sendmail')({
    smtpHost:'localhost',
    smtpPort: 1025
});
const {RESET_PASSWORD} = require('./emailTypes');

module.exports = (to, type, content, successcb, failurecb) =>{
    console.log("Inside send email");
    var html, subject;
    switch(type){
        case RESET_PASSWORD:
            console.log("Inside case");
            html = `Your new password is ${content}. Please don't forget to change your password as soon as possible.`;
            subject = `Go Program Password Reset`;
            break;
    }
    const mailOptions = {
        from: 'no-reply-go-program@sjsu.edu',
        to,
        subject,
        html
    }
    console.log('Now sending mail');
    sendmail(mailOptions, function(err, info) {
        if(err){
            console.log("Inside err - ", err, err.stack);
            failurecb(err);
            return;
        }
        console.log("Info -- ", info);
        successcb(info);
    });
}