const handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id))
  try {
    const q = m.quoted || m
    const msgContent = q.msg || q
    const mime = msgContent.mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const mtype = q.mtype || Object.keys(q.message || {})[0]

    // Reacciona con 🗣️ (no espera la respuesta)
    conn.sendMessage(m.chat, { react: { text: '🗣️', key: m.key } }).catch(() => {})

    const originalCaption = (msgContent.caption || q.text || '').trim()
    const finalCaption = text.trim() || (m.quoted ? originalCaption : '') || '🗣️'

    const opts = { mentions: users, quoted: m }

    if (isMedia && m.quoted) {
      const media = await q.download()

      switch (mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: media, caption: finalCaption, ...opts })
          break
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mimetype: 'video/mp4', ...opts })
          break
        case 'audioMessage':
          await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', fileName: 'audio.mp3', ...opts })
          break
        case 'stickerMessage':
          await conn.sendMessage(m.chat, { sticker: media, ...opts })
          break
        default:
          await conn.sendMessage(m.chat, { text: finalCaption, ...opts })
          break
      }
    } else {
      await conn.sendMessage(m.chat, { text: finalCaption, ...opts })
    }

  } catch {
    await conn.sendMessage(m.chat, { text: '🗣️', mentions: users, quoted: m })
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notify|notificar|noti|n|rcc|hidetah|hidet)$/i
handler.group = true
handler.admin = true

export default handler