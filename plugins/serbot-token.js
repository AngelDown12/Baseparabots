let handler = async (m, { conn, usedPrefix }) => {
  if (!m.sticker || !m.fileSha256) return

  global.db.data.stickercmds = global.db.data.stickercmds || {}
  let id = m.fileSha256.toString('base64')
  let data = global.db.data.stickercmds[id]
  if (!data) return // Sticker no registrado

  let cmd = data.command
  let plugin = Object.values(global.plugins).find(p =>
    p.command && (
      typeof p.command === 'string' ? p.command === cmd :
      p.command instanceof RegExp ? p.command.test(cmd) :
      Array.isArray(p.command) ? p.command.includes(cmd) : false
    )
  )

  if (!plugin) return m.reply('⚠️ El comando vinculado ya no existe.')

  try {
    // Ejecutamos el comando como si el usuario lo hubiera enviado
    m.text = usedPrefix + cmd
    await plugin(m, { conn, args: [], usedPrefix, command: cmd })
  } catch (e) {
    await m.reply(`❌ Error al ejecutar: ${e.message}`)
  }
}
handler.customPrefix = () => true // se ejecuta en cualquier mensaje
handler.command = new RegExp
handler.group = false
handler.private = false

export default handler