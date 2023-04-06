const { PREFIX, TEMP_FOLDER } = require("../config");
const { downloadContentFromMessage } = require("@adiwajshing/baileys");
const path = require("path");
const { writeFile } = require("fs/promises"); //biblioteca que cria escreve arquivos transformados pelo bot

function extractDataFromMessage(baileysMessage) {  //extrai o conteúdo de mensagens se for um dos tipos abaixo
  const textMessage = baileysMessage.message?.conversation; 
  const extendedTextMessage = baileysMessage.message?.extendedTextMessage?.text;
  const imageTextMessage = baileysMessage.message?.imageMessage?.caption;
  const videoTextMessage = baileysMessage.message?.videoMessage?.caption;

  const fullMessage =
    textMessage || extendedTextMessage || imageTextMessage || videoTextMessage; // recebe um dos tipos citados caso seja true

  if (!fullMessage) {
    return {
      remoteJid: "",
      fullMessage: "",
      command: "",/////////////////////////////se for false enche a variavel de nada e false
      args: "",
      isImage: false,
      isVideo: false,
      isSticker: false,
    };
  }

  const isImage = is(baileysMessage, "image");///////////////////faz um teste lógico para descobrir o tipo de mensagem recebido função é definida abaixo
  const isVideo = is(baileysMessage, "video");
  const isSticker = is(baileysMessage, "sticker");

  const [command, ...args] = fullMessage.trim().split(" ");//desestrutura alguns elementos da mensagem

  const arg = args.reduce((acc, arg) => acc + " " + arg, "").trim();//trata os dados de argumento para que o bot possa usá-los

  return {
    remoteJid: baileysMessage?.key?.remoteJid,
    fullMessage,
    command: command.replace(PREFIX, "").trim(),/////////////////////////////retorna o contéudo preenchido para que o bot possa usá-lo
    args: arg.trim(),
    isImage,
    isVideo,
    isSticker,
  };
}

function is(baileysMessage, context) {
  return (
    !!baileysMessage.message?.[`${context}Message`] ||  //teste lógico AND com objetos forçados a ser tratados como valores booleanos,pois podem retornar null ou um atributo de objeto
    !!baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[ //de acordo com o context diz o mosta o tipo da mensagem
      `${context}Message`
    ]
  );
}

function getContent(baileysMessage, type) {
  return (
    baileysMessage.message?.[`${type}Message`] ||
    baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[//recebe o conteudo da mensagem
      `${type}Message`
    ]
  );
}

function isCommand(baileysMessage) {
  const { fullMessage } = extractDataFromMessage(baileysMessage);

  return fullMessage && fullMessage.startsWith(PREFIX);// se  mensagem não for null ou false e  começar com uma / retorna
}

async function download(baileysMessage, fileName, context, extension) {
  const content = getContent(baileysMessage, context);//baixa arquivos de midia nomeia e armazena

  if (!content) {
    return null;
  }

  const stream = await downloadContentFromMessage(content, context);// função da biblioteca principal

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);// junta arquivo carregado com os pedaços recebidos "junta o download em um arquivo"
  }

  const filePath = path.resolve(TEMP_FOLDER, `${fileName}.${extension}`);//definição do nome do arquivo e local de armazenamento

  await writeFile(filePath, buffer);//escreve o arquivo e armazena

  return filePath;
}

async function downloadImage(baileysMessage, fileName) {
  return await download(baileysMessage, fileName, "image", "png");////////definição de funções de transformação de arquivo baseado no tipo
}

async function downloadSticker(baileysMessage, fileName) {
  return await download(baileysMessage, fileName, "sticker", "webp");
}

async function downloadVideo(baileysMessage, fileName) {
  return await download(baileysMessage, fileName, "video", "mp4");
}

module.exports = {
  downloadImage,
  downloadVideo,
  downloadSticker,
  extractDataFromMessage,
  isCommand,
};
