export async function before(m, { conn, usedPrefix }) {
  if (!m.sticker || !m.fileSha256) return

  let id = m.fileSha256.toString('base64')
  let data = global.db.data.stickercmds?.[id]
  if (!data) return

  let cmd = data.command
  let plugin = Object.values(global.plugins).find(
    p => p?.command && (typeof p.command === 'string'
      ? p.command === cmd
      : p.command instanceof RegExp
        ? p.command.test(cmd)
        : Array.isArray(p.command)
          ? p.command.includes(cmd)
          : false)
  )

  if (!plugin) return

  let fakeMsg = Object.create(m)
  fakeMsg.text = usedPrefix + cmd
  fakeMsg.args = cmd.split(' ')
  fakeMsg.command = cmd
  fakeMsg.plugin = plugin

  try {
    await plugin(fakeMsg, { conn, args: [], usedPrefix, command: cmd })
  } catch (e) {
    await conn.reply(m.chat, `⚠️ Error al ejecutar el comando vinculado: ${e}`, m)
  }
}