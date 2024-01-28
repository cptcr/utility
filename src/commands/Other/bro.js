const Schema = require("../../Schemas.js/brocount");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("bro")
    .setDescription("bro count")
    .addSubcommand(command => command
        .setName("count")
        .setDescription("Bro count")
        .addUserOption(option => option.setName("user").setDescription("The bro you want to get the count from").setRequired(false))
    )
    .addSubcommand(command => command
        .setName("leaderboard")
        .setDescription("Leaderboard bro")
    ),

    async execute(interaction, client) {
        const { options, guild } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case "count":
                const target = options.getUser("user") || interaction.user;
                const dataCount = await Schema.findOne({ User: target.id });

                if (dataCount) {
                    const embed = new EmbedBuilder()
                        .setDescription(`${target} has ${dataCount.Count}x said bro`)
                        .setColor("White");

                    await interaction.reply({
                        embeds: [embed]
                    });
                } else {
                    await interaction.reply({
                        content: "This user doesn't have said bro",
                        ephemeral: true
                    });
                }
                break;
            case "leaderboard":
                const data = await Schema.find({}); // Find all data

                data.sort((a, b) => b.Count - a.Count); // Sort by Count in descending order
                data.splice(10); // Limit to the top 10

                const text = data.map((entry, index) => {
                    const dataUser = client.users.cache.get(entry.User) || "Unknown";
                    return `${index + 1}. ${dataUser} | Count: ${entry.Count}`;
                }).join("\n");

                const embed = new EmbedBuilder()
                    .setColor("White")
                    .setDescription(text);

                await interaction.reply({ embeds: [embed] });
                break;
        }
    }
};