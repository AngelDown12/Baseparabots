let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  // Acepta "promote" o "pornote" seguido de una mención
  if (!body || !/^(promote|pornote)\s+@/i.test(body)) {
    return;
  }

  if (!mentioned || !mentioned.length) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Etiqueta a alguien para darle admin.', m);
  }

  const user = mentioned[0];

  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'No pude reconocer al usuario mencionado.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    // No dice nada si lo logra
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, 'No se pudo dar admin.', m);
  }
};

handler.customPrefix = /^(promote|pornote)\s+@/i;
handler.command = new RegExp(); // No hace falta si usas solo customPrefix
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;