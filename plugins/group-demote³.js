let handler = async (m, { conn }) => {
  const body = m.text?.trim().toLowerCase();

  if (body !== 'demote') return;

  const user = m.quoted?.sender;
  if (!user) {

    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
};

handler.customPrefix = /^demote$/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;