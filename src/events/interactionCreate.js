const { ComponentType } = require("discord.js");

const { error, searching, found, video } = require("../../utils/embeds");
const createActionRow = require("../../utils/selectMenu");

const animeService = require("../services/animeService");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "search") {
    const anime = interaction.options.getString("anime");
    const searchingEmbed = searching();

    await interaction.reply({ embeds: [searchingEmbed] });

    const animes = await animeService.search(anime);
    if (animes instanceof Error) {
      await interaction.editReply({ embeds: [error(animes)] });
      interaction.delete({ timeout: 10000 });
      return;
    }

    const actionRow = createActionRow();

    let reply = await interaction.editReply({
      embeds: [found(animes, 0)],
      components: [actionRow],
    });

    const animeCollector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) =>
        i.user.id === interaction.user.id && i.customId === interaction.id,
      idle: 30_000,
    });

    animeCollector.on("collect", async (interaction) => {
      animeCollector.stop();
      if (!interaction.values.length) {
        await reply.edit("timeout");
        await reply.delete({ timeout: 10000 });
        return;
      }

      await reply.edit({ embeds: [searchingEmbed], components: [] });

      const eps = await animeService.searchEps([...interaction.values]);
      if (eps instanceof Error) {
        await reply.edit({ embeds: [error(animes)] });
        await reply.delete({ timeout: 10000 });
        return;
      }

      reply = await reply.edit({
        embeds: [found(eps, 1)],
      });

      const epCollector = interaction.channel.createMessageCollector({
        filter: (message) =>
          Number(message.content) <= eps.length &&
          message.author.id === interaction.user.id &&
          message.channelId === interaction.channelId,
        max: 1,
        idle: 60_000,
      });

      epCollector.on("collect", async (message) => {
        epCollector.stop();
        message.delete();

        await reply.edit({ embeds: [searchingEmbed] });

        const ep = eps.find((ep) => ep.label === Number(message.content));

        if (!ep || ep.length === 0) {
          await reply.edit({ content: `Ep dont found`, embeds: [] });
          await reply.delete({ timeout: 10000 });
          return;
        }

        const url = await animeService.getVideo(ep.value);
        if (url instanceof Error) {
          await reply.edit({ embeds: [error(animes)] });
          await reply.delete({ timeout: 10000 });
          return;
        }

        await reply.edit({ embeds: [video(url)] });
        return;
      });
    });
  }
};
