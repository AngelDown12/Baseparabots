import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Verifica que se haya respondido a un sticker
  const quoted = m.quoted
  if (!quoted || quoted.mtype !== 'stickerMessage') {
    return conn.sendMessage(m.chat, {
      text: '❌ *Responde a un sticker para vincularlo con un comando.*'
    }, { quoted: m })
  }

  // Verifica que se haya escrito un comando para vincular
  const comando = args[0]
  if (!comando) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *Debes escribir el comando a ejecutar.*\n📌 Ejemplo:\n${usedPrefix + command} ping`
    }, { quoted: m })
  }

  // Intenta obtener el ID del sticker
  const sha = quoted.fileSha256?.toString('base64')
  if (!sha) {
    return conn.sendMessage(m.chat, {
      text: '❌ *No se pudo obtener el identificador del sticker.*'
    }, { quoted: m })
  }

  // Guarda el comando en comandos.json
  const filePath = path.join('./', 'comandos.json')
  let data = {}
  if (fs.existsSync(filePath)) {
    try {
      data = JSON.parse(fs.readFileSync(filePath))
    } catch {
      data = {}
    }
  }

  data[sha] = comando
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  return conn.sendMessage(m.chat, {
    text: `✅ *Sticker vinculado correctamente al comando:* \`${comando}\``,
    quoted: m
  })
}

handler.help = ['addco <comando>']
handler.tags = ['tools']
handler.command = ['addco']
handler.register = true

export default handler