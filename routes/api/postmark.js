var postmark = require("postmark");
var client = new postmark.Client(process.env.POSTMARK_KEY);

module.exports = {

    sendEmail: function (user, password, name, actionUrl, cb) {
        client.sendEmailWithTemplate({
            "From": "support@raisebetter.uk",
            "To": user,
            "TemplateId": 2682581,
            "TemplateModel": {
                "name": name,
                "action_url": actionUrl,
                "login_code": password,
                "username": user,
                "support_email": "support@raisebetter.uk",
                "help_url": "https://raisebetter.uk/faq"
            }
        }, cb);
    },

    sendFirstLoginEmail: function (email, emailCode, name, cb) {
        var actionUrl = "https://raisebetter.uk/first-login?username=" + email + "&code=" + emailCode;

        client.sendEmailWithTemplate({
            "From": "support@raisebetter.uk",
            "To": email,
            "TemplateId": 2682581,
            "TemplateModel": {
                "name": name,
                "action_url": actionUrl,
                "login_code": emailCode,
                "username": email,
                "support_email": "support@raisebetter.uk",
                "help_url": "https://raisebetter.uk/faq"
            }
        }, cb);

    }
};
