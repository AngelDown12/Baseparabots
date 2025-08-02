let handler = async (m, { conn, text }) => {
  let number, user;

  // Si no se proporciona texto ni se responde a alguien
  if (!text && !m.quoted) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Etiqueta o responde a alguien para darle admin.', m);
  }

  // Si hay texto, verificar si es número, mención o no válido
  if (text) {
    if (isNaN(text)) {
      if (text.includes('@')) {
        number = text.split('@')[1];
      }
    } else {
      number = text;
    }
  }

  // Validación de longitud de número
  if (number && (number.length > 13 || number.length < 11)) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Ese número no es válido.', m);
  }

  // Obtener el usuario en formato JID
  try {
    if (number) {
      user = number + "@s.whatsapp.net";
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender;
    }
  } catch {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'No se pudo procesar al usuario.', m);
  }

  // Si no se pudo obtener el usuario
  if (!user) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'No encontré a quién darle admin.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], "promote");
    // No dice nada si sale bien
  } catch {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, 'No se pudo dar admin.', m);
  }
};

handler.help = ["@usuario*"].map(v => "promote " + v);
handler.tags = ["group"];
handler.command = /^(promote|pornote|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;