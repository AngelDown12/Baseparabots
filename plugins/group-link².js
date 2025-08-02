const handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return;

  conn.sendMessage(m.chat, { text: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat) });
};

handler.customPrefix = /^(link)/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;

export default handler;