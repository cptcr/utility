const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("presence")
    .setDescription("Change the bots presence")
    .addStringOption(option => option
        .setName("type")
        .setDescription("The presence type")
        .addChoices(
            {name: "• 🌙 Idle", value: "idle"},
            {name: "• 🟢 Online", value: "online"},
            {name: "• ⭕ DND", value: "dnd"},
            {name: "• 👀 Invisible", value: "invisible"}
        )
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const {user, options} = interaction;
        const presence = options.getString("type");
        if (user.id !== process.env.OWNERID && user.id !== process.env.JUSTIN) {
            await interaction.reply({
                content: `Error: \`Cannot set presence to ${presence}\` because you are not the owner!`,
                ephemeral: true
            })
        }

        const embed = new EmbedBuilder()
        .setTitle("Presence")
        .setDescription(`Successfully set presence to **${presence}**!`)
        .setColor("White")

        await client.user.setStatus(presence);

        return await interaction.reply({
            embeds: [embed]
        })
    }
}