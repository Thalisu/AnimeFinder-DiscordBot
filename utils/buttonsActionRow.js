const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = (ep, eps) => {
  const prevEp = new ButtonBuilder()
    .setEmoji("◀️")
    .setCustomId("prev")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(ep.label === 1);

  const epCount = new ButtonBuilder()
    .setCustomId("pagecount")
    .setLabel(`${ep.label}/${eps.length}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  const nextEp = new ButtonBuilder()
    .setEmoji("▶️")
    .setCustomId("next")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(ep.label === eps.length);

  return new ActionRowBuilder().setComponents(prevEp, epCount, nextEp);
};
