const config = {
  name: "مشموش",
  version: "1.1.0",
  description: "تحدث مع نينو",
  usage: "[text]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "XaviaTeam"
}

const langData = {
  "ar_SY": {
    "on": "مشموش يعمل الآن 🙂",
    "off": "مشموش متوقف الآن 😐",
    "alreadyOn": "مشموش يعمل بالفعل 🙂",
    "alreadyOff": "مشموش متوقف بالفعل 😐",
    "missingInput": "الرجاء إدخال النص للتحدث مع مشموش 🤔",
    "noResult": "مشموش لا يفهم ما تقول :(",
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا 🤕"
  }
}

const ninoData = require('./nino.json');

function generateReply(input) {
  const keywords = getKeywords(input);
  const tone = getTone(input);
  const reply = generateText(keywords, tone);
  const sticker = generateSticker(tone);
  return { reply, sticker };
}

function getKeywords(input) {
  const keywords = [];
  const words = input.split(' ');
  for (const word of words) {
    if (ninoData.keywords.includes(word)) {
      keywords.push(word);
    }
  }
  return keywords;
}

function getTone(input) {
  let tone = '';
  if (input.includes('؟')) {
    tone = 'question';
  } else if (input.includes('!')) {
    tone = 'excited';
  } else {
    tone = 'normal';
  }
  return tone;
}

function generateText(keywords, tone) {
  let text = '';
  switch (tone) {
    case 'question':
      text = ninoData.responses.question[Math.floor(Math.random() * ninoData.responses.question.length)].replace('{keyword}', keywords[0]);
      break;
    case 'excited':
      text = ninoData.responses.excited[Math.floor(Math.random() * ninoData.responses.excited.length)].replace('{keyword}', keywords[0]);
      break;
    default:
      text = ninoData.responses.normal[Math.floor(Math.random() * ninoData.responses.normal.length)].replace('{keyword}', keywords[0]);
  }
  return text;
}

function generateSticker(tone) {
  let sticker = '';
  switch (tone) {
    case 'question':
      sticker = '🤔';
      break;
    case 'excited':
      sticker = '😄';
      break;
    default:
      sticker = '😐';
  }
  return sticker;
}

let isActive = {};

async function onCall({ message, args, getLang }) {
  const input = args.join(" ");
  if (!input) return message.reply(getLang("missingInput"));
  if (input == "on") {
    if (isActive[message.threadID]) return message.reply(getLang("alreadyOn"));
    isActive[message.threadID] = true;
    return message.reply(getLang("on"));
  } else if (input == "off") {
    if (!isActive[message.threadID]) return message.reply(getLang("alreadyOff"));
    delete isActive[message.threadID];
    return message.reply(getLang("off"));
  }
  if (!isActive[message.threadID]) return;
  const { reply, sticker } = generateReply(input);
  return message.reply(reply + ' ' + sticker);
}

export default {
  config,
  langData,
  onCall
}
