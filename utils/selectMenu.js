const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = (interaction, animes) => {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder(`select...`)
    .setMinValues(1)
    .setMaxValues(1)
    .setOptions(
      animes.map((anime) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(anime.label)
          .setValue(anime.value)
      )
    );

  return new ActionRowBuilder().setComponents(selectMenu);
};
