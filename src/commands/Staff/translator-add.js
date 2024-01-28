const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const owners = [
    "833752068300210236", //Franki
    "931870926797160538", //Toowake
    "822111322548076624", //Justin
    "759037138929975297", //Jason
];
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("translator-add")
    .setDescription("Add a translator to the staff team")
    .addStringOption(option => option.setName("type").setDescription("Which language?").addChoices(
        {name: "RU Russian", value: "1146529357284778166"},
        {name: "CN (simplified) Chinese", value: "1146529453590196367"},
        {name: "DE German", value: "1146529413396168764"},
        {name: "NL Dutch", value: "1146529666740535386"},
        {name: "PL Polish", value: "1146529626315829278"},
        {name: "CZ Czech", value: "1147521119818108938"},
        {name: "HU Hungarian", value: "1148199456764854355"},
        {name: "JP Japanese", value: "1148307657283878972"},
        {name: "FR French", value: "1148307892521414716"},
        {name: "KR South Korean", value: "1148307736895959150"},
        {name: "ES Espanol", value: "1148307884896169984"},
        {name: "GR Greece", value: `1151941787334737940`}
    ).setRequired(true))
    .addUserOption(option => option.setName("target").setDescription("Which member?").setRequired(true)),

    async execute (interaction) {
        const { guild, user, member, options } = interaction;
        const language = options.getString("type");
        const target = options.getMember("target");

        if (!owners.includes(user.id)) {
            return await interaction.reply({
                content: "You cant add translators!",
                ephemeral: true
            })
        };

        const mainRoleID = "1146529214703603852";
        const mainrole = await guild.roles.cache.get(mainRoleID);

        const langRole = await guild.roles.cache.get(language);

        if (!target.roles.cache.has(mainRoleID)) {
            await target.roles.add(mainrole)
        };

        if (target.roles.cache.has(language)) {
            return await interaction.reply({
                content: `${target} already has the role ${langRole}!`,
                ephemeral: true
            })
        } else {
            const embed = new EmbedBuilder()
                .addFields(
                    { name: "Target:", value: `${target.user.tag} (<@${target.id}>)`, inline: false },
                    { name: "Language:", value: `${langRole.name} (<@${langRole.id}>)`, inline: false },
                    { name: "Added by:", value: `${interaction.user.tag} (<@${interaction.user.id}>)`, inline: false }
                )
                .setColor("White");
        
            await target.roles.add(langRole).catch(err => {
                return interaction.reply({
                    content: `${err}`,
                    ephemeral: true
                });
            });
        
            await interaction.reply({
                embeds: [embed]
            });
        
            // Create a log object
            const logEntry = {
                timestamp: new Date().toISOString(),
                target: {
                    username: target.user.username,
                    id: target.id
                },
                language: {
                    name: langRole.name,
                    id: langRole.id
                },
                addedBy: {
                    username: interaction.user.username,
                    id: interaction.user.id
                }
            };
        
            // Read the current log data from the file
            let currentLogData = [];
            try {
                const rawData = fs.readFileSync('log.json', 'utf-8');
                currentLogData = JSON.parse(rawData);
            } catch (error) {
                console.error('Error reading log file:', error);
            }
        
            // Add the new log entry
            currentLogData.push(logEntry);
        
            // Write the updated log data back to the file
            fs.writeFileSync('log.json', JSON.stringify(currentLogData, null, 2));
        }
        
    }
}