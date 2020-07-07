const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.resetmail = (link,user) => {
    let htmlString = nodeMailer.renderTemplate({user: user, link: link}, '/password/reset_password_page.ejs');
    
    nodeMailer.transporter.sendMail({
        from:'harshlynn90@gmail.com',
        to: user.email,
       subject: "Request for password change",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}
