let handler = async (m, { conn }) => {
  const body = m.text?.trim().toLowerCase();

  if (body !== 'demote') return;

  const user = m.quoted?.sender;

  if (!user) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Responde al mensaje de quien quieras quitar.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    // No dice nada si lo logra
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, 'No se pudo quitar el admin.', m);
  }
};

handler.customPrefix = /^demote$/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;