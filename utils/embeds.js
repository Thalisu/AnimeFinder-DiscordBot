const { EmbedBuilder } = require("discord.js");

const error = (err) => {
  return new EmbedBuilder().setTitle(`Error: ${err}`).setColor("Red");
};

const searching = (anime) => {
  return new EmbedBuilder().setTitle(`wait a second...`).setColor("Red");
};

const found = (results, what) => {
  return new EmbedBuilder()
    .setTitle(`found ${results.length} ${what === 0 ? "animes" : "episodes"}`)
    .setDescription(
      `${
        what === 0
          ? "select bellow your desired one"
          : `Selected anime have ${results.length} episodes, write down what episode you want to watch`
      }`
    )
    .setColor("Green");
};

const video = (url) => {
  return new EmbedBuilder().setTitle(url).setColor("Green");
};

module.exports = { error, searching, found, video };
