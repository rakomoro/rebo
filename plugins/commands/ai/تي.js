import axios from 'axios';

const config = {
  name: "تيست",
  description: "دردشة ذكية (نصوص، صور، صوت)",
  usage: "ai [سؤالك/صور/صوت]",
  credits: "Perplexity",
  cooldown: 5
};

async function onCall({ message, args, senderID, attachments }) {
  let query = args.join(" ").trim();
  let extraMedia = "";

  if (attachments && attachments.length) {
    let urls = attachments.filter(a => a.type === "photo" || a.type === "audio").map(a => a.url);
    if (urls.length) extraMedia = "\n[media]: " + urls.join(", ");
  }

  // طلب فارغ
  if (!query &&!extraMedia.length) {
    return message.reply("اهلا كيف برو 🐢");
  }

  let prompt = query + extraMedia;

  try {
    const res = await axios.get(
      `https://gpt-api.aesther.one/api/gpt`,
      {
        params: {
          prompt,
          uid: senderID,
          model: "gpt-4"
        }
      }
    );
    
    let replyText = res.data?.response || "ما لقيت جواب...";
    let finalMsg = `❀━━━━〖 مشمش 〗━━━━❀\n${replyText}\n❀━━━━〖 راكــــو 〗━━━━❀`;
    message.reply(finalMsg);

  } catch (e) {
    message.reply("😔 حصل خطأ في الاتصال بالذكاء الاصطناعي!");
  }
}

export default {
  config,
  onCall
}
 
