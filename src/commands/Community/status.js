const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Website status"),

    async execute (interaction) {
        const apiKey = process.env.UPTIME;
        const monitorId = [
            { //panel
                name: "Panel",
                monitorId: "795386810",
            },
            { //node
                name: "Node",
                monitorId: "79538681",
            },
            { //website
                name: "Website",
                monitorId: "795386815",
            },
        ];

        const embed = new EmbedBuilder()
        .setTitle("Status")
        .setURL("https://stats.uptimerobot.com/gO76MCPGp5")
        .setAuthor({ name: "made by toowake"})
        .setFooter({ text: "By uptimerobot API"})

        monitorId.forEach(id => {
            
            const url = `https://api.uptimerobot.com/v2/getMonitor?format=json&api_key=${apiKey}&id=${id.monitorId}&logs`;

            fetch(url)
            .then(async data => {
                const cache = data
                await embed.addFields({ name: `${id.name}`, value: `${data}`, inline: false})
                console.log(cache)
            })
            .catch(async error => {
                await embed.addFields({ name: `${id.name}`, value: `Error: ${error}`, inline: false})
                console.error('Error:', error);
            });

        })
        
        await interaction.reply({ embeds: [embed], ephemeral: true})

    }
}