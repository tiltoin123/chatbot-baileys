const { BOT_EMOJI, BOT_NAME, PREFIX } = require("../config");

function errorMessage(message) {
  return `${BOT_EMOJI} ❌ Erro! ${message}`;
}

function warningMessage(message) {
  return `${BOT_EMOJI} ⚠ Atenção! ${message}`;
}

function menuMessage() {//este arquivo contem menu de comando do bot para interação com o usuário sua definição está em actions/index
  const date = new Date();

  return `╭━━⪩ BEM VINDO! ⪨━━
▢
▢ • ${BOT_NAME}
▢ • Data: ${date.toLocaleDateString("pt-br")}
▢ • Hora: ${date.toLocaleTimeString("pt-br")}
▢ • Prefixo: ${PREFIX}
▢
╰━━─「🪐」─━━

╭━━⪩ MENU ⪨━━
▢
▢ • ${PREFIX}cep
▢ • ${PREFIX}ping
▢ • ${PREFIX}sticker
▢ • ${PREFIX}to-image
▢
╰━━─「🚀」─━━`;
}

module.exports = {
  errorMessage,
  menuMessage,
  warningMessage,
};
