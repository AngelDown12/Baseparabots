let handler = async (m, { conn, args, usedPrefix, command }) => {
  let sticker = m.quoted && m.quoted.fileSha256
  if (!sticker) throw `✳️ Responde a un sticker para usar este comando.`

  let id = sticker.toString('base64')
  let texto = args.join(' ').trim()
  if (!texto) throw `📌 Escribe el comando que quieras asignar a este sticker.\n\n📌 Ejemplo:\n${usedPrefix + command} .menu`

  global.db.data.stickercmds = global.db.data.stickercmds || {}

  global.db.data.stickercmds[id] = {
    command: texto,
    addedBy: m.sender,
    date: Date.now()
  }

  await m.reply(`✅ Comando *${texto}* vinculado a este sticker con éxito.`)
}
handler.help = ['add <comando>']
handler.tags = ['tools']
handler.command = ['add']
handler.register = true

export default handler