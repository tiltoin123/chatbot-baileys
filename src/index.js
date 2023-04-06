const connect = require("./connection");
const middlewares = require("./middlewares");

async function start() { //roda o bot instanciado no middlewares
  const bot = await connect();
  await middlewares(bot);
}

start();
