let handler = async (m, { conn, text }) => {
  let number;

  if (isNaN(text) && !text.match(/@/g)) {
    // No hay número ni mención válida
  } else if (isNaN(text)) {
    number = text.split`@`[1];
  } else if (!isNaN(text)) {
    number = text;
  }

  if (!text && !m.quoted) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Etiqueta o responde al que quieras quitar.', m);
  }

  if (number && (number.length > 13 || (number.length < 11 && number.length > 0))) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Ese número no es válido.', m);
  }

  let user;

  try {
    if (text) {
      user = number + "@s.whatsapp.net";
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender;
    }
  } catch (e) {
    return conn.reply(m.chat, 'Hubo un problema al detectar al usuario.', m);
  }

  if (!user) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'No encontré al usuario.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], "demote");
    // Sin mensaje si se ejecuta bien
  } catch (e) {
    // Sin mensaje si falla
  }
};

handler.help = ["@usuario*"].map((v) => "demote " + v);
handler.tags = ["group"];
handler.command = /^(demote|quitaradmin|quitarpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;