const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const img = require("../util/img");
const punks = require("../util/punks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("GM! Say it back!")
    .addIntegerOption((option) =>
      option
        .setName("inscription")
        .setDescription("Inscription ID")
        .setMinValue(6389)
        .setMaxValue(49890)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("phrase")
        .setDescription("What should the punk say?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const id = interaction.options.getInteger("inscription");
    const phrase = interaction.options.getString("phrase");
    const punk = punks.getPunk(id);
    const image = await img.say({ name: punk.name, phrase: phrase });
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
