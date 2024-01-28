const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const schema = require("./src/Schemas.js/ping-whitelist");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("whitelist-ping")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command
        .setName("add")
        .setDescription("add a user to the whitelist for pinging you")
        .addStringOption(option => option
            .setName("user-id")
            .setDescription("The users id")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("The reason for the whitelist")
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName("view")
        .setDescription("Shows if someone is whitelisted")
        .addStringOption(option => option
            .setName("user-id")
            .setDescription("The users id")
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName("remove")
        .setDescription("Remove a user from the whitelist")
        .addStringOption(option => option
            .setName("user-id")
            .setDescription("The users id")
            .setRequired(true)
        )
    ),

    async execute (interaction) {
        await interaction.reply("test")
    }
}