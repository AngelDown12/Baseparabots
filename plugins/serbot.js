let handler = async (m, { conn, args, usedPrefix, command }) => {
  let sticker = m.quoted?.fileSha256
  if (!sticker) return conn.sendMessage(m.chat, {
    text: '✳️ Responde a un *sticker* para vincularlo a un comando.',
    contextInfo: {
      externalAdReply: {
        title: "𝐀𝐧𝐠𝐞𝐥 𝐁𝐨𝐭 𝐃𝐞𝐥𝐚𝐲",
        body: "𝐀𝐧𝐠𝐞𝐥 𝐁𝐨𝐭 𝐃𝐞𝐥𝐚𝐲",
        thumbnailUrl: "https://qu.ax/JRCMQ.jpg",
        sourceUrl: '',
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m })

  let id = sticker.toString('base64')
  let cmd = (args[0] || '').toLowerCase()
  if (!cmd) return m.reply(`📌 Escribe el nombre de un comando.\n\nEjemplo: *${usedPrefix + command} menu*`)

  let plugin = Object.values(global.plugins).find(p =>
    p?.command && (
      typeof p.command === 'string'
        ? p.command === cmd
        : p.command instanceof RegExp
          ? p.command.test(cmd)
          : Array.isArray(p.command)
            ? p.command.includes(cmd)
            : false
    )
  )

  if (!plugin) return conn.sendMessage(m.chat, {
    text: `❌ El comando "*${cmd}*" no existe en ningún plugin.`,
    contextInfo: {
      externalAdReply: {
        title: "𝐀𝐧𝐠𝐞𝐥 𝐁𝐨𝐭 𝐃𝐞𝐥𝐚𝐲",
        body: "𝐀𝐧𝐠𝐞𝐥 𝐁𝐨𝐭 𝐃𝐞𝐥𝐚𝐲",
        thumbnailUrl: "https://qu.ax/JRCMQ.jpg",
        sourceUrl: '',
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m })

  global.db.data.stickercmds = global.db.data.stickercmds || {}
  global.db.data.stickercmds[id] = {
    command: cmd,
    addedBy: m.sender,
    date: Date.now()
  }

  m.reply(`✅ El sticker fue vinculado al comando *${cmd}* correctamente.`)
}
handler.help = ['add <comando>']
handler.tags = ['tools']
handler.command = ['add']
handler.register = true

export default handler

// Función before (ejecuta el comando si detecta el sticker)
export async function before(m, { conn, usedPrefix }) {
  if (!m.sticker || !m.fileSha256) return

  let id = m.fileSha256.toString('base64')
  let data = global.db.data.stickercmds?.[id]
  if (!data) return

  let cmd = data.command
  let plugin = Object.values(global.plugins).find(p =>
    p?.command && (
      typeof p.command === 'string'
        ? p.command === cmd
        : p.command instanceof RegExp
          ? p.command.test(cmd)
          : Array.isArray(p.command)
            ? p.command.includes(cmd)
            : false
    )
  )

  if (!plugin) return

  let fakeMsg = Object.create(m)
  fakeMsg.text = usedPrefix + cmd
  fakeMsg.args = []
  fakeMsg.command = cmd
  fakeMsg.plugin = plugin

  try {
    await plugin(fakeMsg, { conn, args: [], usedPrefix, command: cmd })
  } catch (e) {
    await conn.reply(m.chat, `⚠️ Error al ejecutar el comando vinculado: ${e}`, m)
  }
}

// Comando para eliminar vínculo de sticker
let delHandler = async (m) => {
  let sticker = m.quoted?.fileSha256
  if (!sticker) return conn.sendMessage(m.chat, {
    text: '✳️ Responde a un *sticker* que esté vinculado para eliminarlo.',
    contextInfo: {
      externalAdReply: {
        title: "𝐀𝐧𝐠𝐞𝐥 𝐁𝐨𝐭 𝐃𝐞𝐥𝐚𝐲",
        body: "𝐀𝐧𝐠𝐞𝐥 𝐁𝐨𝐭 𝐃𝐞𝐥𝐚𝐲",
        thumbnailUrl: "https://qu.ax/JRCMQ.jpg",
        sourceUrl: '',
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m })

  let id = sticker.toString('base64')
  if (!global.db.data.stickercmds?.[id]) return m.reply('⚠️ Este sticker no tiene ningún comando asignado.')

  delete global.db.data.stickercmds[id]
  m.reply(`✅ El sticker fue desvinculado correctamente.`)
}
delHandler.help = ['delstick']
delHandler.tags = ['tools']
delHandler.command = ['delstick', 'delscmd']
delHandler.register = true

export { delHandler as handler }