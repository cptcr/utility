const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("give-pos")
    .setDescription("Give Position")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => option
        .setName("position")
        .setDescription("The position the member should get in this server")
        .addChoices(
            {name: "Head Mod", value: "1121354236115046440"}, 
            {name: "Mod", value: "1145453790263259186"}, 
            {name: "Support", value: "1145453790263259186"}, 
            {name: "Coding Helper JS", value: "1145454208015945888"}, 
            {name: "Coding Helper PY", value: "1145453953996308581"}, 
            {name: "Coding Helper HTML/CSS", value: "1145454516070785117"}, 
            {name: "Coding Helper C#", value: "1145454422919491624"}, 
            {name: "Coding Helper C++", value: "1145454327339692042"}, 
            {name: "Hardware Helper", value: "1145454579287343104"}, 
            {name: "Software Helper", value: "1145454775215866046"}
        )
        .setRequired(true))
    .addUserOption(option => option.setName("target").setDescription("The target").setRequired(true)),

    async execute (interaction, client) {
        const { options, guild, member, user } = interaction;
        const ROLE_ID = options.getString("position");
        const target = options.getMember("target");

        if (target === user) {
            return await interaction.reply({
                content: "You cant give yourself this role!",
                ephemeral: true
            })
        }

        const embed = new EmbedBuilder()
        .setDescription(`Added <@&${ROLE_ID}> to ${target}!`)
        .setColor("Green")

        await interaction.reply({ embeds: [embed], ephemeral: true})

        
        try {
            const role = guild.roles.cache.get(ROLE_ID);
            await target.roles.add(role);
          } catch (error) {
            console.log(error)
        }
    }
}