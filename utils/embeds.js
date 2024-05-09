const { EmbedBuilder } = require("discord.js");

const error = (msg, c) => {
  return new EmbedBuilder()
    .setTitle(
      c === 0
        ? `Error: ${msg}`
        : c === 1
        ? `Too many results for ${msg}`
        : `No animes found`
    )
    .setColor("Red");
};

const searching = (anime, c) => {
  return new EmbedBuilder()
    .setTitle(
      c === 0
        ? `getting results for ${anime}...`
        : c === 1
        ? `getting ${anime} episodes...`
        : ``
    )
    .setColor("Red");
};

const found = (results, c) => {
  return new EmbedBuilder()
    .setTitle(`found ${results.length} ${c === 0 ? "animes" : "episodes"}`)
    .setDescription(
      c === 0
        ? "select bellow your desired one"
        : `Selected anime have ${results.length} episodes, write down c episode you want to watch`
    )
    .setColor("Green");
};

const video = (url) => {
  return new EmbedBuilder().setTitle(url).setColor("Green");
};

module.exports = { error, searching, found, video };
