const path = require("path");
//este arquivo salva algumas variaveis de uso comum do sistema
const PREFIX = "/";  //prefixo de comando
const BOT_EMOJI = "🤖"; //este emote identifica uma respostqa do bot
const BOT_NAME = "Super Bot";
const TEMP_FOLDER = path.resolve(__dirname, "..", "assets", "temp"); // pasta temporaria de arquivos é onde salvamos a conexão , imagens e figurinhas


module.exports = {
  BOT_EMOJI,
  BOT_NAME,
  PREFIX,
  TEMP_FOLDER,
};
