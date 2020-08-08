
const sgMail = require('@sendgrid/mail');
function sendEmail(article,source,destination){
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  var fileName = article.title.toLowerCase().split(" ").join("");
  fileName = fileName + ".html";
  var content = article.content.replace( /(<([^>]+)>)/ig, '');

  const msg = {
    to: destination,
    from: source,
    subject: article.title,
    text: content,
    html: article.content,
    attachments: [
      {
        content: Buffer.from(content).toString('base64'),
        filename: article.title + ".html",
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