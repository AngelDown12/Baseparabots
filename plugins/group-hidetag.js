import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id))
    const q = m.quoted || m
    const c = m.quoted ? await m.getQuotedObj() : m
    const mime = (q.msg || q).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const mtype = q.mtype || Object.keys(q.message || {})[0]

    // ✨ Reacciona con 🗣️ al mensaje
    await conn.sendMessage(m.chat, {
      react: {
        text: '🗣️',
        key: m.key
      }
    })

    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = text.trim() || originalCaption || ''

    if (isMedia) {
      const media = await q.download()

      const options = {
        caption: finalCaption,
        mentions: users,
        quoted: m
      }

      switch (mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: media, ...options })
          break
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: media, mimetype: 'video/mp4', ...options })
          break
        case 'audioMessage':
          await conn.sendMessage(m.chat, {
            audio: media,
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3',
            mentions: users
          }, { quoted: m })
          break
        case 'stickerMessage':
          await conn.sendMessage(m.chat, {
            sticker: media,
            mentions: users
          }, { quoted: m })
          break
      }

    } else {
      // Texto sin multimedia
      const fakeContent = generateWAMessageFromContent(
        m.chat,
        { [mtype]: q.message?.[mtype] || { text: finalCaption } },
        { quoted: m, userJid: conn.user.id }
      )

      const msg = conn.cMod(m.chat, fakeContent, finalCaption, conn.user.jid, {
        mentions: users
      })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }

  } catch (e) {
    // Fallback si falla: solo texto
    const users = participants.map(u => conn.decodeJid(u.id))
    const fallbackText = text?.trim() || ''
    await conn.sendMessage(m.chat, {
      text: fallbackText,
      mentions: users
    }, { quoted: m })
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notify|notificar|noti|n|rcc|hidetah|hidet)$/i
handler.group = true
handler.admin = true

export default handler