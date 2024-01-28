const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Positions = require("../../../staff.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("meet")
    .setDescription("Add your meet the team")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendTTSMessages)
    .addStringOption(option => option.setName("description").setDescription("your descriptions (use % for a new line)").setRequired(true))
    .addStringOption(option => option.setName("color").setDescription("The HEX Color code (#ffffff)").setRequired(true).setMinLength(7).setMaxLength(7))
    .addBooleanOption(option => option.setName("timestamp").setDescription("Timestamp?").setRequired(true))
    .addStringOption(option => option.setName("position").setDescription("Whats your position here in Nexus?").setRequired(true).addChoices(
        {name: "Head Developer", value: "Head Developer"},
        {name: "Head Mod", value: "Head Mod"},
        {name: "Nexus Developer", value: "Nexus Developer"},
        {name: "Head Translator", value: "Head Translator"},
        {name: "Translator", value: "Translator"},
        {name: "Support", value: "Support"},
        {name: "Coding Helper JS", value: "Coding Helper JS"},
        {name: "Coding Helper PY", value: "Coding Helper PY"},
        {name: "Coding Helper C#", value: "Coding Helper C#"},
        {name: "Coding Helper HTML/CSS", value: "Coding Helper HTML/CSS"},
        {name: "Coding Helper C++", value: "Coding Helper C++"},
        {name: "Hardware Helper", value: "Hardware Helper"},
        {name: "Software Helper", value: "Software Helper"}
    ))
    .addStringOption(option => option.setName("website").setDescription("Your Website").setRequired(false))
    .addStringOption(option => option.setName("buy-me-a-coffee").setDescription("Yout buy me a coffee site").setRequired(false))
    .addStringOption(option => option.setName("email").setDescription("Your nexus host email").setRequired(false)),

    async execute (interaction, client) {
        const channelID = "1145450516684488806";
        const channel = await client.channels.cache.get(channelID);
        const { options, user, member } = interaction;
        const avatar = user.displayAvatarURL();
        const color = options.getString("color");
        const desc = options.getString("description");
        const website = options.getString("website");
        const timestamp = options.getBoolean("timestamp");
        const pos = options.getString("position");
        const coffee = options.getString("buy-me-a-coffee");
        const mail = options.getString("email")

        //roles
        const roles = [
            "1121354182323093515", //Head Developer
            "1121354236115046440", //Head Mod
            "1121354301625880667", //Moderator
            "1147920149194735616", //Nexus Developer
            "1146533619385503784", //Head Translator
            "1146529214703603852", //Translator
            "1145453790263259186", //Support
            "1145454208015945888", //CH JS
            "1145453953996308581", //CH PY
            "1145454422919491624", //CH C#
            "1145454516070785117", //CH HTML/CSS
            "1145454327339692042", //CH C++
            "1145454579287343104", //HH
            "1145454775215866046", //SH
        ]

        const rolePos = Positions.position[pos];

        const roleID = roles[rolePos];
        
        if (!interaction.member.roles.cache.has(roleID)) {
            await interaction.reply({
                content: "Sorry, you dont have this position :(",
                ephemeral: true
            })
        } else {
        
            function newLine(text) {
                const lines = text.split('%');
                const formattedText = lines.join('\n');
                return formattedText;
            }
    
            const mails = [
                "baluhh@nexus-hosting.tech",
                "diortecxcz@nexus-hosting.tech",
                "franki@nexus-hosting.tech",
                "ggod@nexus-hosting.tech",
                "jason@nexus-hosting.tech",
                "soy@nexus-hosting.tech",
                "toowake@nexus-hosting.tech",
                "verox@nexus-hosting.tech"
            ]
    
            const inputText = desc;
            const outputText = newLine(inputText);
    
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.username}`, iconURL: avatar})
            .setThumbnail(avatar)
            .setColor(`${color}`)
            .setDescription(`${outputText}`)
            .setTitle(`About ${user.username}`)
            .addFields({
                name: "Position:",
                value: `${pos}`
            })
    
            if (!website.startsWith("https://")) {
                return await interaction.reply({
                    content: "Please use a https:// website!",
                    ephemeral: true
                })
            }
    
            if (mail) {
                if (!mails.includes(mail)) {
                    await interaction.reply({
                        content: `${mail} is not a valid email!`,
                        ephemeral: true
                    })
                } else {
                    await embed.addFields({name: "E-Mail:", value: mail, inline: false})
                }
            }
    
            if (coffee) {
                if (!coffee.startsWith("https://buymeacoffee.com")) {
                    await interaction.reply({
                        content: "Please use a valid buy me a coffee link!",
                        ephemeral: true
                    })
                } else {
                    await embed.addFields({name: "Buy me a coffee:", value: coffee, inline: false})
                }
            }
    
            if (timestamp) {
                embed.setTimestamp()
            }
    
            if (website) {
                embed.addFields(
                    {name: "Website:", value: `${website}`}
                )
            }
    
            await channel.send({
                embeds: [embed],
            })
    
            await interaction.reply({
                content: "Successfully send your about me!",
                ephemeral: true
            })

        }
    }
}