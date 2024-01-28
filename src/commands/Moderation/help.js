const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, PartialWebhookMixin } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute (interaction, client) {
        const embed = new EmbedBuilder()
        .setTitle("Help Point")
        .setDescription("Here you can find everything")
        .setColor("White")

        const commandButton = new ButtonBuilder()
        .setCustomId("commands")
        .setStyle(ButtonStyle.Primary)
        .setLabel("commands")

        const serverHelp = new ButtonBuilder()
        .setCustomId("server-help")
        .setStyle(ButtonStyle.Primary)

        
    }
}