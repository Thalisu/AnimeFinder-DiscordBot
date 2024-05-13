const { EmbedBuilder } = require("discord.js");

const error = (msg, c) => {
  return new EmbedBuilder()
    .setTitle(
      c === 0
        ? `${msg}`
        : c === 1
        ? `Muitos resultados para ${msg}`
        : `Nenhum resultado encontrado`
    )
    .setColor("Red");
};

const searching = (oque, c, ep) => {
  return new EmbedBuilder()
    .setTitle(
      c === 0
        ? `Conseguindo resultados para ${oque}...`
        : c === 1
        ? `Conseguindo a lista de episódios de ${oque}`
        : c === 2
        ? `Conseguindo o episódio ${ep} de ${oque}`
        : `Montando o ${oque}...`
    )
    .setColor("Red");
};

const found = (results, c) => {
  return new EmbedBuilder()
    .setTitle(`Encontrei ${results.length} ${c === 0 ? "animes" : "episódios"}`)
    .setDescription(
      c === 0
        ? "Selecione abaixo o anime desejado"
        : `O anime selecionado tem ${results.length} episódios, mande abaixo o episódio que você quer`
    )
    .setColor("Green");
};

const video = (url, anime, ep) => {
  return new EmbedBuilder()
    .setTitle(`${anime}${ep ? ` episodio ${ep}` : ""}`)
    .setURL(url)
    .setColor("Green");
};

const calendar = (day, title, img) => {};

module.exports = { error, searching, found, video, calendar };
