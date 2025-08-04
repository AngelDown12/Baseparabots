import fs from 'fs'
import path from 'path'
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, generateMessageID, delay } from 'github:ds6/meta'
import { fileURLToPath } from 'url'
import { join } from 'path'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const methodCode = true // true para usar código de emparejamiento

// Función para generar IDs aleatorios
function randomID(length = 6) {
  return crypto.randomBytes(length).toString('hex')
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const authFolderB = randomID()
  const sessionPath = `./serbot/${authFolderB}`

  // Crear la carpeta de sesión si no existe
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true })
  }

  const credsPath = `${sessionPath}/creds.json`
  let usePairingCode = false

  // Si se recibe código base64
  try {
    if (args[0]) {
      let decoded = Buffer.from(args[0], "base64").toString("utf-8")
      let parsed = JSON.parse(decoded)

      if (typeof parsed !== 'object' || parsed === null) {
        return m.reply("❌ El código recibido no es válido.")
      }

      fs.writeFileSync(credsPath, JSON.stringify(parsed, null, 2))
    } else {
      usePairingCode = true
    }
  } catch (e) {
    console.error("Error procesando código:", e)
    return m.reply("❌ Código dañado o incompleto. Intenta nuevamente.")
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()

  const connBot = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: state,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    syncFullHistory: false,
    defaultQueryTimeoutMs: undefined,
    getMessage: async () => ({ conversation: "ok" }),
  })

  if (usePairingCode && methodCode && !connBot.authState.creds.registered) {
    const phoneNumber = m.sender.split('@')[0].slice(2)
    let code = await connBot.requestPairingCode(phoneNumber)
    m.reply(`🔗 Código de emparejamiento para subbot:\n\n${code}\n\n📌 Úsalo dentro de los siguientes 1-2 minutos.`)
  }

  connBot.ev.on('creds.update', saveCreds)
}

handler.help = ['code']
handler.tags = ['jadibot']
handler.command = /^code$/i
handler.private = true

export default handler