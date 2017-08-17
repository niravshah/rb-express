var postmark = require("postmark");
var client = new postmark.Client(process.env.POSTMARK_KEY);


module.exports = {

  sendEmail: function (user, password,name, actionUrl) {

    client.sendEmailWithTemplate({
      "From": "hello@raisebetter.uk",
      "To": user,
      "TemplateId": 2682581,
      "TemplateModel": {
        "name": name,
        "action_url": actionUrl,
        "login_code": password,
        "username": user,
        "trial_length": "trial_length_Value",
        "trial_start_date": "trial_start_date_Value",
        "trial_end_date": "trial_end_date_Value",
        "support_email": "support_email_Value",
        "live_chat_url": "live_chat_url_Value",
        "help_url": "help_url_Value"
      }
    });

  }
};
