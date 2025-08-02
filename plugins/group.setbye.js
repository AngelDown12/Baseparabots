let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.isGroup) throw '❗Este comando solo se usa en grupos.'
  if (!args[0]) throw `✳️ Usa el comando así:\n\n${usedPrefix + command} Adiós @user 😈`

  global.db.data.chats[m.chat].sBye = args.join(' ')
  m.reply('✅ Despedida personalizada guardada.')
}
handler.command = ['setbye']
handler.group = true
handler.admin = true
export default handler