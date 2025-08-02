let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.isGroup) throw '❗Este comando solo se usa en grupos.'
  if (!args[0]) throw `✳️ Usa el comando así:\n\n${usedPrefix + command} Hola @user`

  global.db.data.chats[m.chat].sWelcome = args.join(' ')
  m.reply('✅ Bienvenida personalizada guardada.')
}
handler.command = ['setwelcome']
handler.group = true
handler.admin = true
export default handler