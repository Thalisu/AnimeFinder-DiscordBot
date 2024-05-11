const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = (index, max) => {
  const prevEp = new ButtonBuilder()
    .setEmoji("◀️")
    .setCustomId("prev")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(index === 1);

  const epCount = new ButtonBuilder()
    .setCustomId("pagecount")
    .setLabel(`${index}/${max}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  const nextEp = new ButtonBuilder()
    .setEmoji("▶️")
    .setCustomId("next")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(index === max);

  return new ActionRowBuilder().setComponents(prevEp, epCount, nextEp);
};
