const config = {
  name: "جبب",
  description: "جلب صورة من فئة محددة",
  usage: "[فئة مثل waifu/neko]",
  cooldown: 3,
  permissions: [2],
  credits: "XaviaTeam",
  nsfw: true
};

const langData = {
  en_US: {
    invalidCategory: "Invalid category. Available:\n{categories}",
    error: "Something went wrong. Try again later."
},
  ar_SY: {
    invalidCategory: "⚠️ الفئة غير صالحة. الفئات المتاحة : \n = blush, brofist, celebrate, cheers, clap ,cool, cuddle, dance, facepalm, happy ,headbang, hug, laugh, love, pat,poke, roll, shrug, smile, smug, sorry, surprised, thumbsup, wave, wink, woah, yay, yes",
    error: "❌ حدث خطأ، حاول لاحقًا..."
}
};

const endpoints = = [
  "blush", "brofist", "celebrate", "cheers", "clap",
  "cool", "cuddle", "dance", "facepalm", "happy",
  "headbang", "hug", "laugh", "love", "pat",
  "poke", "roll", "shrug", "smile", "smug",
  "sorry", "surprised", "thumbsup", "wave", "wink",
  "woah", "yay", "yes"
];

async function onCall({ message, args, getLang}) {
  try {
    const category = args[0]?.toLowerCase();

    if (!category ||!endpoints.includes(category)) {
      return message.reply(getLang("invalidCategory", {
        categories: endpoints.join(", ")
}));
}

    const response = await global.GET(`${global.xva_api.nsfw}/${category}`);
    const imageData = response.data;

    if (!imageData?.url) return message.reply(getLang("error"));

    const image = await global.getStream(imageData.url);
    await message.reply({ attachment: [image]});

} catch (err) {
    console.error("ملو Error:", err);
    await message.reply(getLang("error"));
}
}

export default {
  config,
  langData,
  onCall
};
