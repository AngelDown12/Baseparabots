let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.isGroup) return global.dfail('group', m, conn);

  const groupMetadata = await conn.groupMetadata(m.chat);
  const botNumber = conn.user.jid || conn.user.id || conn.user;
  const botParticipant = groupMetadata.participants.find(p => p.id === botNumber);
  if (!botParticipant?.admin) return global.dfail('botAdmin', m, conn);

  let isClose = {
    open: 'not_announcement',
    close: 'announcement',
    abrir: 'not_announcement',
    cerrar: 'announcement',
    abierto: 'not_announcement',
    cerrado: 'announcement',
  }[args[0]?.toLowerCase()];

  if (!isClose) throw `
*╭─ ❖ ── ✦ ── ✧ ── ❖ ──┓* 
*┠┉↯ ${usedPrefix + command} abrir*
*┠┉↯ ${usedPrefix + command} cerrar*
*╰─ ❖ ── ✦ ── ✧ ── ❖ ──┛*
`.trim();

  await conn.groupSettingUpdate(m.chat, isClose);

  await m.reply("☁️ 𝘎𝘳𝘶𝘱𝘰 𝘊𝘰𝘯𝘧𝘪𝘨𝘶𝘳𝘢𝘥𝘰 𝘊𝘰𝘳𝘳𝘦𝘤𝘵𝘢𝘮𝘦𝘯𝘵𝘦");
};

handler.help = ["group abrir / cerrar"];
handler.tags = ["group"];
handler.command = /^(grupo|group)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;