const { timeoutDelete } = require("../../utils/functions");
const { searching } = require("../../utils/embeds");

const buttonCollector = require("./button");

module.exports = async (interaction, eps, formatedCurrentAnime) => {
  const messageCollector = interaction.channel.createMessageCollector({
    filter: (i) =>
      Number(i.content) <= eps.length &&
      i.author.id === interaction.user.id &&
      i.channelId === interaction.channelId,
    time: 30 * 1000,
  });

  messageCollector.on("collect", async (m) => {
    messageCollector.stop();
    m.delete();

    await interaction.editReply({
      embeds: [searching(formatedCurrentAnime, 2, m.content)],
    });

    let ep = eps.find((ep) => ep.label === Number(m.content));

    if (!ep || ep.length === 0) {
      await interaction.editReply({ content: `Ep dont found`, embeds: [] });
      timeoutDelete(interaction);
      return;
    }

    await buttonCollector(interaction, eps, ep, formatedCurrentAnime);
  });
};
