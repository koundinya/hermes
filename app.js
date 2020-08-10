const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const { sendEmail } = require('./mailer')
const parser = require("article-parser");

const whiteListUser = 'girishkoundinya'
const kindleCommand = new RegExp(/^kindle/)
const source = process.env.EMAIL_SOURCE;
const destination = process.env.EMAIL_DESTINATION;

const emailParser = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

const emailRegex = new RegExp(emailParser);

var STATUS = {
    USER_INVALID: 1,
    URL_INVALID: 2,
    CONTENT_INVALID: 3
};

bot.start(function(ctx){
    ctx.reply('Welcome!');
});

bot.hears(kindleCommand, async (ctx) => {
    try {
        verify(ctx);
        var url = parseURL(ctx);
        const article = await parseContent(url);
        const response = await sendEmail(article, source, destination);
        ctx.reply(response);
    } catch(err) {
        handleErr(ctx,err);
    }
});

const parseContent = async (url) => {
    try {
        return await parser.extract("https://" + url);
    } catch (err) {
        console.log('parser.extract_error', err);
        throw STATUS.CONTENT_INVALID;
    }
};

function handleErr(ctx,err){
    switch (err) {
        case STATUS.URL_INVALID:
            ctx.reply("Sorry, That is not a valid url");
            break;
        case STATUS.USER_INVALID:
            ctx.reply("Sorry, Not allowed to talk to you");
            break;
        case STATUS.CONTENT_INVALID:
            ctx.reply("Sorry, Unable to get content");
            break;
    }
}

function parseURL(ctx) {
    var content = ctx.message.text;
    if(content.match(emailRegex)) {
        return content.match(emailRegex)[0];
      } else {
        throw STATUS.URL_INVALID;
      }
}


function verify(ctx) {
    if(!verifyUsername(ctx.from.username)){
        throw STATUS.USER_INVALID;
    }
}

function verifyUsername(name){
    if (name != whiteListUser){
        return false;
    }
    return true;
}

const PORT = process.env.PORT || 3000;
const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "STATUS": "UP" }));
})

app.listen(PORT, () => {
    bot.launch()
    console.log(`listening at ${PORT}`)
})
