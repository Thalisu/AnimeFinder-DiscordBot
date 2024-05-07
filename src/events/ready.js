const registerCommands = require("../register-commands");

module.exports = (client, c) => {
  console.log(`${c.user.tag} is online`);
  registerCommands();
};
