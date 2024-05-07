const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const { token, clientId } = require("../utils/config");

const commands = [
  {
    name: "search",
    description: "searchForAnime",
    options: [
      {
        name: "anime",
        description: "desired anime",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
];

module.exports = async () => {
  const rest = new REST().setToken(token);
  try {
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log("slash commands registered");
  } catch (error) {
    console.log(`error: ${error}`);
  }
};
