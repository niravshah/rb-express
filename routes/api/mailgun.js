const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

module.exports = {

  emailLogonDetails: function (user, password, mobile) {
    var data = {
      from: 'hello@raisebetter.uk',
      to: user.email,
      subject: 'Welcome to Raise Better!',
      text: 'Username: ' + user.email + ' Password: ' + password + ' Mobile No: ' + mobile
    };

    mailgun.messages().send(data, function (error, body) {
      //console.log(body);
    });

  },

  emailContactQuery: function (fname, lname, email, mobile, query) {

    var data = {
      from: 'hello@raisebetter.uk',
      to: 'nirav@raisebetter.uk',
      subject: 'New User Query from: ' + fname + ' ' + lname,
      text: 'Query: ' + query + ' Email: ' + email + ' Mobile No: ' + mobile
    };

    mailgun.messages().send(data, function (error, resp) {
      //console.log(error,resp);
    });
  }
};
