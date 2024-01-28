const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, Embed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("send")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("hjfsajhsdf"),

    async execute (interaction, client) {
        const {guild, channel} = interaction;

        const embed = new EmbedBuilder()
        .setTitle("Community Bot Application Form")
        .setDescription("Want to applicate your bot? Read this. Hope to see your Bot here soon!")
        .setColor("White")
        .setFields(
            {name: "Requirements:", value: "The bot must have a provacy policy page and a terms of service page. And follow the discord dev tos.", inline: false},
            {name: "Scam Bots:", value: "Only tested bots would appear in this server.", inline: false},
            {name: "Open Source:", value: "You bot has to be open source.", inline: false},
            {name: "Other Stuff:", value: "The bot has to be on [TOP.GG](https://top.gg/) or [DISCORD BOT LIST](https://discordbotlist.com)!", inline: false},
            {name: "DM:", value: "The Bot should only dm people for the following reasons: \nRemind Command \nVoice Channel Updates (J2C) \nModmail \nTicket \nModeration Actions", inline: false},
            {name: "Permissions:", value: "Your bot would only get the follofing perms: \nView Channels \nCreate Invite \nChange Nickname \nSend Messages \nSend Messages in Threads \nEmbed Links \nAttach Files \nAdd Reactions \nUse external emojis \nUse external Stickers \nManage Messages \nManage Threads \nRead Message History \nConnect \nSpeak \nVideo \nUse Activites", inline: false},
            {name: "Bypassing/Abusing the perms:", value: "When you bypass unallowed perms or abuse perms you and your bot would getting banned from here."},
            {name: "Oauth2:", value: "Your bot shouldnt have the `Join Servers for you` intent. If it has, remove it. Otherwise we would reject your application", inline: false}
        )
        .setFooter({ text: "Nexus Community Bots" })

        const buttonx = new ButtonBuilder()
        .setCustomId("applicate")
        .setLabel("Applicate")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)

        const row = new ActionRowBuilder().addComponents(buttonx)

        await channel.send({
            embeds: [embed],
            components: [row]
        })

        await interaction.reply({
            content: "Message send",
            ephemeral: true
        })
    }
}