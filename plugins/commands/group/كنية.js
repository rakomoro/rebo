const config = {
  name: "كنية",
  aliases: ["nickname"],
  description: "لتغيير كنية المستخدم في المجموعة",
  usage: "كنية + كنيتك الجديدة",
  permissions: [0],
  credits: "XaviaTeam",
  cooldown: 3,
};
export default config;
async function onCall({ message, args, data}) {
  if (!data.thread?.info?.isGroup)
    return message.reply("❌ هذا الأمر يعمل فقط داخل المجموعات");

  const newNickname = args.join(" ");
  if (!newNickname)
    return message.reply("📝 يرجى كتابة الكنية بعد الأمر\nمثال: كنية ملك القروب");

  const userID = message.senderID;

  try {
    await global.api.changeNickname(
      newNickname,
      message.threadID,
      userID
);

    message.reply(`✅ تم تغيير كنيتك إلى: ${newNickname}`);
} catch (err) {
    console.error(err);
    message.reply("❌ حدث خطأ أثناء تغيير الكنية، حاول لاحقاً");
}
}
export { onCall};
