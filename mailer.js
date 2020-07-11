
function sendEmail(article){
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'girish.koundinya126@kindle.com',
    from: 'share@koundinya.xyz',
    subject: article.title,
    text: article.content,
    html: article.content,
    attachments: [
      {
        content: Buffer.from(article.content).toString('base64'),
        filename: (article.title.trim() + ".html"),
        type: "text/html",
        disposition: "attachment"
      }
    ]
  };
  console.log(msg);
  sgMail.send(msg).then(() => {
    console.log('Message sent')
  }).catch((error) => {
    console.log(error.response.body)
    console.log(error.response.body.errors[0].message)
  })
}

exports.sendEmail = sendEmail