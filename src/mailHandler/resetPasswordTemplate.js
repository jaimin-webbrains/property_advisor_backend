class ResetPasswordTemplate {
    MailSent(data) {
        return (
            "<!DOCTYPE html>" +
            '<html lang="en">' +
            "" +
            "<head>" +
            '    <meta charset="UTF-8">' +
            "    <title>Document</title>" +
            "<style>p{margin:0px;}</style></head>" +
            "" +
            "<body> <p>Hello " +
            ",</p>" +
            "<br /><br />" +
            "<p>Your OTP is"+" "+
             data.otp+ "</p>"+
            "<br /> "+
            "<br/><br/><p>Regards,</p><p>Property Advisor</p><br />" +
            "</body></html>"
        );
    }
}
module.exports = new ResetPasswordTemplate();
