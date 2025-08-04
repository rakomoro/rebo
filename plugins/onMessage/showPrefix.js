import axios from 'axios';

const langData = {
  "en_US": {
    "prefix": `${global.config.NAME} رمز البوت هو: {prefix}`
}
};

async function onCall({ message, getLang, data}) {
  const body = message.body?.toLowerCase()?.trim();
  const prefixTriggers = ["prefix", "prefix?", "Prefix", "prefix؟"];

  if (!prefixTriggers.includes(body) || message.senderID === global.botID) return;

  const prefix = data?.thread?.data?.prefix || global.config.PREFIX;

  try {
    // جلب صورة من نفس API تبع بلو
    const response = await axios.get("https://rapido.zetsu.xyz/api/ba", {
      responseType: 'stream'
});

    await message.reply({
      body: getLang("prefix", { prefix}),
      attachment: response.data
});

} catch (error) {
    console.error("❌ خطأ أثناء تحميل الصورة:", error);
    await message.reply(getLang("prefix", { prefix}));
}
}

export default {
  langData,
  onCall
};
