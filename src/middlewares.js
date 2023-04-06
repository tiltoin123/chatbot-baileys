const { BOT_EMOJI } = require("./config");
const { isCommand, extractDataFromMessage } = require("./utils");
const Action = require("./actions"); // importação de classe
const { menuMessage } = require("./utils/messages");

async function middlewares(bot) {
  bot.ev.on("messages.upsert", async ({ messages }) => {//capta novas mensagem independente de quem seja
    const baileysMessage = messages[0];

    if (!baileysMessage?.message || !isCommand(baileysMessage)) {// testa se a mensagem recebida é um comando
      return;
    }

    const action = new Action(bot, baileysMessage); // instancia da classe actions

    const { command, remoteJid } = extractDataFromMessage(baileysMessage); //desestrutura mensagem pegando o id e commando definição da função está na pasta utils

    switch (command.toLowerCase()) {
      case "cep":
        await action.cep();
        break;
      case "f":
      case "fig":
      case "s":
      case "sticker":
        await action.sticker();
        break;                                        //testa se o comando recebido está no escopo do programa
      case "menu":
        await bot.sendMessage(remoteJid, {
          text: `${BOT_EMOJI}\n\n${menuMessage()}`,
        });
        break;
      case "ping":
        await bot.sendMessage(remoteJid, { text: `${BOT_EMOJI} Pong!` });
        break;
      case "toimage":
      case "toimg":
        await action.toImage();
        break;
    }
  });
}

module.exports = middlewares;
