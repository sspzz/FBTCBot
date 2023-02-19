const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const punks = require("../util/punks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punk")
    .setDescription("Show a Forgotten BTC Punk")
    .addIntegerOption((option) =>
      option
        .setName("inscription")
        .setDescription("Inscription ID")
        // .setMinValue(0)
        // .setMaxValue(999)
        .setRequired(true)
    ),
  async execute(interaction) {
    const inscription = interaction.options.getInteger("inscription");
    const punk = punks.getPunk(inscription);
    if (punk != undefined) {
      const fields = [];
      fields.push({ name: "Id", value: "" + punk.id, inline: false });
      fields.push({
        name: "Inscription",
        value: punk.inscription,
        inline: false,
      });
      const file = new AttachmentBuilder(`./punks/${punk.name}.png`, { name: 'punk.png' });
      const embed = new EmbedBuilder()
        .setTitle(punk.name)
        .setURL(`https://ordinals.com/inscription/${inscription}`)
        .setImage(`attachment://punk.png`)
        .addFields(fields);
      return interaction.reply({ embeds: [embed], files: [file] });
    } else {
      return interaction.reply("No such FBP");
    }
  },
};
