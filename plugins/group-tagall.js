const handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupName = groupMetadata.subject;
  const total = participants.length;

  let texto = `*¡  MENCION GENERAL  ¡*\n\n`;
  texto += `*PARA ${total} MEMBERS* 🗣️\n\n`;
  texto += `» *INFO:*\n\n`;
  texto += `╭⊹ *${groupName.toUpperCase()}.* ⊹\n\n`;

  for (const user of participants) {
    const numero = user.id.split('@')[0];
    texto += `🗣️ @${numero}\n`;
  }

  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    mentions: participants.map(p => p.id),
  });
};

handler.command = /^(tagall|invocar|invocacion|invocación|todos|talibanes)$/i;
handler.group = true;
handler.admin = true;

export default handler;