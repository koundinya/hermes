const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const mailer = require('./mailer')
const parser = require("article-parser");

const whiteListUser = 'girishkoundinya'
const kindleCommand = new RegExp(/^kindle/)
const source = 'share@koundinya.xyz'
const destination = 'girish.koundinya126@kindle.com'

const emailParser = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

const emailRegex = new RegExp(emailParser);

var STATUS = {
    USER_INVALID: 1,
    URL_INVALID: 2,
    CONTENT_INVALID: 3
};

bot.start(function(cxt){
    ctx.reply('Welcome!');
});

bot.hears(kindleCommand, function (ctx){
    try {
        verify(ctx);
        var url = parseURL(ctx);
        parseContent(url,function(returnedArt){
            var article = returnedArt;
            mailer.sendEmail(article,source,destination);
            ctx.reply(
            'Your content will be available on your kindle soon, Happy reading:)');
        });

    }catch(err) {
        handleErr(ctx,err);
    }
});

function parseContent(url,callback){
    const getArticle = async (url) => {
        try {
            const article = await parser.extract("https://" + url);
            return article;
        } catch (err) {
            console.log(err);
        }
      };

    getArticle(url).then((article) => {
        callback(article);
      }).catch((err) => {
        console.log(err);
        throw STATUS.CONTENT_INVALID;
      });
}

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
