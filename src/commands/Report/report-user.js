const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Schema = require("../../Schemas.js/report");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report a user")
    .addUserOption(option => option.setName("user").setDescription("The user you want to report us").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("please provide us more information why you report this user").setRequired(true))
    .addBooleanOption(option => option.setName("anonym").setDescription("Do you want to send this information anonym?").setRequired(true)),
    async execute (interaction, client) {
        const {options, guild, user} = interaction;
        const target = options.getUser("user");
        const reason = options.getString("reason");
        const anonym = options.getBoolean("anonym");

        let executor;

        if (anonym) {
            executor = interaction.user;
        } else {
            executor = "Anonyom"
        }

        const accept = new ButtonBuilder()
        .setCustomId("ghjja")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success)
        .setDisabled(false)

        const reject = new ButtonBuilder()
        .setCustomId("slslaa")
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger)

        const embedChannel = new EmbedBuilder()
        .setTitle("New Reported User")
        .addFields(
            {name: "User:", value: `${target}`, inline: false},
            {name: "Reason:", value: `${reason}`, inline: false},
            {name: "Reported by:", value: `${executor}`, inline: false}
        )
        .setFooter({ text: "Nexus Utility System"})
        .setColor("White")

        const embedReply = new EmbedBuilder()
        .setDescription(`You have reported ${target} with the reason **${reason}** | Anonymus: ${anonym}`)

        const row = new ActionRowBuilder()
        .addComponents(reject, accept)

        const channelID = "1127249938502393897";
        const channel = await client.channels.cache.get(channelID);

        const message = await channel.send(
            {embeds: [embedChannel], components: [row]}
        )

        await Schema.create({
            Guild: guild.id,
            Target: target.id,
            Reason: reason,
            User: user.id,
            Message: message.id
        })

        await interaction.reply(
            {embeds: [embedReply]}
        )
    }
}