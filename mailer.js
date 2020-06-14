
function sendEmail(){
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'girish.koundinya126@kindle.com',
    from: 'share@koundinya.xyz',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    attachments: [
      {
        content: 'PHN0cm9uZz5hbmQgZWFzeSB0byBkbyBhbnl3aGVyZSwgZXZlbiB3aXRoIE5vZGUuanM8L3N0cm9uZz4=',
        filename: "share.html",
        type: "text/html",
        disposition: "attachment"
      }
    ]
  };
  sgMail.send(msg).then(() => {
    console.log('Message sent')
  }).catch((error) => {
    console.log(error.response.body)
    console.log(error.response.body.errors[0].message)
  })
}

exports.sendEmail = sendEmail