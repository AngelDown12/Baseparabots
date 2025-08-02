let handler = async (m, { conn }) => {
  const body = m.text?.trim().toLowerCase();

  // Acepta "promote" o "pornote"
  if (!['promote', 'pornote'].includes(body)) return;

  // Solo si estás respondiendo a alguien
  const user = m.quoted?.sender;
  if (!user) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Responde al mensaje de quien quieras darle admin.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    // No responde si todo sale bien
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, 'No se pudo dar admin.', m);
  }
};

handler.customPrefix = /^(promote|pornote)$/i;
handler.command = new RegExp(); // No necesario si solo usas customPrefix
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;