const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const img = require("../util/img");
const punks = require("../util/punks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gm")
    .setDescription("GM! Say it back!")
    .addIntegerOption((option) =>
      option
        .setName("inscription")
        .setDescription("Inscription ID")
        .setMinValue(6389)
        .setMaxValue(49890)
        .setRequired(true)
    ),
  async execute(interaction) {
    const id = interaction.options.getInteger("inscription");
    const punk = punks.getPunk(id);
    const image = await img.gm({name: punk.name});
    const file = new AttachmentBuilder(image, {
      name: "punk.png",
    });
    const embed = new EmbedBuilder()
      .setTitle(punk.name)
      .setURL(`https://ordinals.com/inscription/${punk.inscription}`)
      .setImage(`attachment://punk.png`);
    return interaction.reply({ embeds: [embed], files: [file] });
  },
};
