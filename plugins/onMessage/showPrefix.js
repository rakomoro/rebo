import axios from 'axios';

const langData = {
    "en_US": {
        "prefix": `${global.config.NAME} رمز البوت هو : {prefix}`
    }
};

const reactions = [
  "blush", "brofist", "celebrate", "cheers", "clap",
  "cool", "cuddle", "dance", "facepalm", "happy",
  "headbang", "hug", "laugh", "love", "pat",
  "poke", "roll", "shrug", "smile", "smug",
  "sorry", "surprised", "thumbsup", "wave", "wink",
  "woah", "yay", "yes"
];

async function onCall({ message, getLang, data }) {
    const messageBody = message.body.toLowerCase().trim();
    const prefixTriggers = [
        "prefix",
        "prefix?",
        "Prefix"

        ];

    if (prefixTriggers.includes(messageBody) && message.senderID !== global.botID) {
        const prefix = data?.thread?.data?.prefix || global.config.PREFIX;
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

        try {
            const { data: gifData } = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${randomReaction}`);
            const response = await axios.get(gifData.url, { responseType: 'stream' });
            await message.reply({
                body: getLang("prefix", { prefix }),
                attachment: response.data
            });
        } catch (error) {
            console.error(error);
            await message.reply(getLang("prefix", { prefix }));
        }
    }
}

export default {
    langData,
    onCall
};
