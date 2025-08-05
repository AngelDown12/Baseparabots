import fs from 'fs';

const handler = async (m, { conn, usedPrefix }) => {
  if (!m.mtype || m.mtype !== 'stickerMessage') return;

  let fileSha = m.msg.fileSha256?.toString('base64');
  if (!fileSha) return;

  const file = './comandos.json';
  if (!fs.existsSync(file)) return;

  let db = {};
  try {
    db = JSON.parse(fs.readFileSync(file));
  } catch {
    return;
  }

  const comando = db[fileSha];
  if (!comando) return;

  // Ejecuta el comando como si el usuario lo hubiera escrito
  m.text = usedPrefix + comando;
  return conn.handleMessage(m, m); // esto ejecuta el comando vinculado
};

export default handler;