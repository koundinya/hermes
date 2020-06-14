const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(function(cxt){
    ctx.reply('Welcome!');
});

bot.hears("hi", function (ctx){
    const mailer = require('./mailer')
    mailer.sendEmail();
    ctx.reply('Hey there')
});

bot.launch()
