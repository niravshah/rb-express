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
    }
};
