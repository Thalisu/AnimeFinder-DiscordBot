const { readdir } = require("node:fs/promises");

module.exports = async (client, path) => {
  try {
    const files = await readdir(path);

    for (const file of files) {
      if (!file.endsWith(".js")) return;

      const event = require(`${path}/${file}`);
      const eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      console.log(`Sucessfully loaded ${eventName}`);
    }
  } catch (err) {
    console.error(err);
  }
};
