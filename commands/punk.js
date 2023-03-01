const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const punks = require("../util/punks");

async function getOwnerAddress(inscription) {
  const response = await fetch(
    `https://ordinals.com/inscription/${inscription}`
  );
  const source = await response.text();
  return source.match(/bc1([A-Za-z0-9]{59})/g)[0];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punk")
    .setDescription("Show a Forgotten BTC Punk")
    .addIntegerOption((option) =>
      option
        .setName("inscription")
        .setDescription("Inscription ID")
        .setMinValue(6389)
        .setMaxValue(49890)
        .setRequired(true)
    ),
  async execute(interaction) {
    const inscriptionId = interaction.options.getInteger("inscription");
    const punk = punks.getPunk(inscriptionId);
    if (punk != undefined) {
      const fields = [];
      // fields.push({ name: "#", value: "" + punk.num, inline: false });
      fields.push({ name: "Id", value: "" + punk.id, inline: false });
      fields.push({
        name: "Inscription",
        value: punk.inscription,
        inline: false,
      });
      fields.push({ name: "Owner", value: await getOwnerAddress(punk.inscription) });
      const file = new AttachmentBuilder(`./punks/${punk.name}.png`, {
        name: "punk.png",
      });
      const embed = new EmbedBuilder()
        .setTitle(punk.name)
        .setURL(`https://ordinals.com/inscription/${punk.inscription}`)
        .setImage(`attachment://punk.png`)
        .addFields(fields);
      return interaction.reply({ embeds: [embed], files: [file] });
    } else {
      return interaction.reply("No such FBP");
    }
  },
};
