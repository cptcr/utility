const whitelist = require('../../Schemas.js/ping-whitelist');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('WhiteList User')
        .addBooleanOption(option => option.setName('new').setDescription('Select a boolean').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
    ,

    async execute (client, interaction, args) {
        if (interaction.user.id === '931870926797160538'){
    const boolean = interaction.options.getBoolean('new');
    const member = interaction.options.getUser('user');
    const whitelisted = await whitelist.findOne({ User: member.id });

    if (boolean == true) {
        if (whitelisted) {
            const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`This users was already witelisted!`)
            .setColor('#ff0000')
            interaction.reply({embeds: [embed], ephemeral: true})
        } else {
            const newSettings = new whitelist({ User: member.id});
            await newSettings.save().catch(() => { });

            const embed = new EmbedBuilder()
            .setTitle('Success')
            .setDescription(`The user ${member} was added to WhiteList!`)
            .setColor('#2bff00')
            interaction.reply({embeds: [embed], ephemeral: true})
        }

    } else if (boolean == false) {
        if (!whitelisted) {
            const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`This users is not whitelisted!`)
            .setColor('#ff0000')
            interaction.reply({embeds: [embed], ephemeral: true})
        }
        const embed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`The user ${member} was removed from WhiteList!`)
        .setColor('#2bff00')
        interaction.reply({embeds: [embed], ephemeral: true})
        await model.deleteMany({ User: member.id });
    }
} else {
    const embed = new EmbedBuilder()
    .setTitle('Error')
    .setDescription(`You don't have permissions to use this command!`)
    .setColor('#ff0000')
    interaction.reply({embeds: [embed], ephemeral: true})
}
},
};
