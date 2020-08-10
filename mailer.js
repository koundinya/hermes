const sgMail = require('@sendgrid/mail');

const SEND_EMAIL_SUCCESS = 'Your content will be available on your kindle soon, Happy reading:)';
const SEND_EMAIL_FAILURE = 'There was an issue sending your content :(';

const sendEmail = async (article, source, destination) => {
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
  try {
    await sgMail.send(msg);
    console.log('Message sent');
    return SEND_EMAIL_SUCCESS;
  }
  catch (error) {
    console.log('error_message', error.response.body.errors[0].message);
    console.log('error_response', error.response.body);
    return SEND_EMAIL_FAILURE;
  }
};

exports.sendEmail = sendEmail;
