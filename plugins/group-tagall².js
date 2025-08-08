const handler = async (m, { conn, participants, isAdmin, isOwner, command }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const total = participants.length;
  let texto = `*!  MENCION GENERAL  !*\n`;
  texto += `*PARA ${total} MIEMBROS* 🗣️\n\n`;

  for (const user of participants) {
    const numero = user.id.split('@')[0];
    texto += `🗣️ @${numero}\n`;
  }

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: participants.map(p => p.id)
  });
};

handler.customPrefix = /^(tagall|invocar|invocacion|invocación|todos|talibanes)/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;

export default handler;