const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys) return !0; // Ignorar mensajes internos (incluidos los del bot)
    if (!m.isGroup) return !1;

    let chat = global.db.data.chats[m.chat];
    let bot = global.db.data.settings[conn.user.jid] || {};
    const isGroupLink = linkRegex.exec(m.text);

    if (chat.antiLink && isGroupLink && !isAdmin) {
        // 🚫 Evitar detectar links enviados por el mismo bot
        if (m.sender === conn.user.jid) return !0;

        // 🛡️ Excepción: permitir link del grupo actual
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
            if (m.text.includes(linkThisGroup)) return !0;
        }

        // ⚠️ Notificar y eliminar mensaje / expulsar si posible
        await conn.reply(m.chat, `*❌ _Un Enlace Detectado_*\n\nNo permitimos enlaces de otros grupos, por eso *@${m.sender.split('@')[0]}* será expulsado.${isBotAdmin ? '' : '\n\n⚠️ No soy admin así que no puedo expulsar :('}`, null, {
            mentions: [m.sender],
        });

        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        }
    }

    return !0;
}