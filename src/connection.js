const {
  default: makeWASocket,
  DisconnectReason,               //importa funções da biblioteca principal
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(                //salva credenciais do login
    "./assets/auth/baileys"
  );

  const bot = makeWASocket({
    printQRInTerminal: true,        //mostra um qrcode no terminal
    auth: state,                    // estado da autenticação definido na biblioteca
    defaultQueryTimeoutMs: undefined,
  });

  bot.ev.on("connection.update", (update) => {          //capta atualizações da conexao
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;         // se a razão da desconexão for o usuario ter deslogada nao tenta relogar

      if (shouldReconnect) {            // roda connect caso condicional acima seja falsa
        connect();
      }
    }
  });

  bot.ev.on("creds.update", saveCreds); //salva credencias caso sejam atualizadas

  return bot;
}

module.exports = connect;
