const config = {
  name: "احفظ",
  aliases: ["teach"],
  description: "تعليم نينو",
  usage: "[type] [key] => [value]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "XaviaTeam",
}

const langData = {
  "ar_SY": {
    "wrongSyntax": "بناء جملة خاطئ ، يرجى المحاولة مرة أخرى",
    "missingInput": "بيانات مفقودة!",
    "succeed": "نجح التدريس!",
    "failed": "فشل التدريس!",
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا"
  }
}

const fs = require('fs');
const ninoData = require('./nino.json');

async function onCall({ message, args, getLang }) {
  const arrow = args.indexOf("=>");
  if (arrow == -1) return message.reply(getLang("wrongSyntax"));
  const type = args[0].toLowerCase();
  if (!["question", "excited", "normal"].includes(type)) return message.reply(getLang("wrongSyntax"));
  const key = args.slice(1, arrow).join(" ");
  const value = args.slice(arrow + 1).join(" ");
  if (!key || !value) return message.reply(getLang("missingInput"));

  if (!ninoData.responses) ninoData.responses = {};
  if (!ninoData.responses[type]) ninoData.responses[type] = [];

  ninoData.responses[type].push(value);
  fs.writeFileSync('./nino.json', JSON.stringify(ninoData, null, 2));
  return message.reply(getLang("succeed"));
}

export default {
  config,
  langData,
  onCall
    }
