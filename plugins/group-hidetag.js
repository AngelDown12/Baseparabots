const handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id))
  try {
    const q = m.quoted || m
    const msgContent = q.msg || q
    const mime = msgContent.mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const mtype = q.mtype || Object.keys(q.message || {})[0]

    // Reacciona con 🗣️ sin esperar
    conn.sendMessage(m.chat, { react: { text: '🗣️', key: m.key } }).catch(() => {})

    // Texto que enviará (el texto que escribiste o el caption original si existe)
    const originalCaption = (msgContent.caption || q.text || '').trim()
    const finalCaption = text.trim() || (m.quoted ? originalCaption : '') || '🗣️'

    const opts = { mentions: users, quoted: m }

    if (isMedia && m.quoted) {
      // Si hay media citada, se descarga y se manda con el texto que escribiste (si hay)
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
      // Si no hay media o no citas, manda texto con mención
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