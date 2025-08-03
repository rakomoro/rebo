const config = {
  name: "كنية-تلقائية",
  eventType: ["participantAdded"],
  description: "تعيين كنية تلقائية للأعضاء الجدد عند انضمامهم للمجموعة",
  credits: "XaviaTeam",
};
export default config;
async function onCall({ message, event, data}) {
  const { addedParticipants} = event;
  if (!data.thread?.info?.isGroup) return;

  for (const participant of addedParticipants) {
    const userID = participant.userID;
    const userInfo = await global.api.getUserInfo(userID);
    const firstName = userInfo?.name?.split(" ")[0] || "عضو";

    // احصاء الموجودين بنفس الاسم
    const allNicknames = data.thread?.info?.nicknames || {};
    let count = 1;
    for (const nick of Object.values(allNicknames)) {
      if (nick?.startsWith(`☆[${firstName}]`)) count++;
}

    const autoNick = `☆[${firstName}]--[ مستجد ${count} ن] ☆`;

    try {
      await global.api.changeNickname(autoNick, message.threadID, userID);
      console.log(`✅ تم تعيين الكنية: ${autoNick}`);
} catch (err) {
      console.error(`❌ خطأ في تعيين الكنية للعضو ${userID}`, err);
}
}
}
export { onCall};

