const search = require("../commands/search");
const callendar = require("../commands/callendar");
const recents = require("../commands/recents");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "search") {
    try {
      await search(interaction);
    } catch (error) {
      console.error(error);
    }
  } else if (interaction.commandName === "calendar") {
    try {
      await callendar(interaction);
    } catch (error) {
      console.error(error);
    }
  } else if (interaction.commandName === "recents") {
    try {
      await recents(interaction);
    } catch (error) {
      console.error(error);
    }
  }
  return;
};
