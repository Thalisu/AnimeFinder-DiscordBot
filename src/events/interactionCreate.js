const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const animeService = require("../services/animeService");

/**
 * @param {Object} param0
 * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
 */

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "search") {
    const anime = interaction.options.getString("anime");

    const msg = new EmbedBuilder()
      .setTitle(`Searching for ${anime}...`)
      .setColor("Red");

    interaction.reply({ embeds: [msg] });

    const foundAnimes = await animeService.search(anime);

    msg
      .setTitle(`found ${foundAnimes.length} animes`)
      .setDescription(`select bellow your desired one`)
      .setColor("Green");

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder(`select...`)
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(
        foundAnimes.map((anime) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(anime.label)
            .setValue(anime.value)
        )
      );

    const actionRow = new ActionRowBuilder().setComponents(selectMenu);

    let reply = await interaction.editReply({
      embeds: [msg],
      components: [actionRow],
    });

    const animeCollector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) =>
        i.user.id === interaction.user.id && i.customId === interaction.id,
      idle: 60_000,
    });

    animeCollector.on("collect", async (interaction) => {
      animeCollector.stop();
      if (!interaction.values.length) {
        interaction.reply("timeout");
        return;
      }

      msg
        .setTitle("fetching the selected anime...")
        .setDescription("just a second")
        .setColor("Red");

      reply.edit({ embeds: [msg], components: [] });

      const foundEps = await animeService.searchEps([...interaction.values]);

      msg
        .setTitle("Anime sucessfully fetched")
        .setDescription(
          `Selected anime have ${foundEps.length} episodes, write down what episode you want to watch`
        )
        .setColor("Green");

      reply = await reply.edit({
        embeds: [msg],
      });

      const epCollector = interaction.channel.createMessageCollector({
        filter: (message) =>
          Number(message.content) <= foundEps.length &&
          message.author.id === interaction.user.id &&
          message.channelId === interaction.channelId,
        max: 1,
        idle: 60_000,
      });

      epCollector.on("collect", async (message) => {
        epCollector.stop();
        msg.setTitle("fetching anime url");
        msg.setDescription("...");
        msg.setColor("Red");

        reply.edit({ embeds: [msg] });

        const ep = foundEps[Number(message)];

        const foundUrl = await animeService.getVideo(ep.value);
        reply.edit({ embeds: [], content: foundUrl });
      });
    });
  }
};
