const { SlashCommandBuilder } = require('discord.js');
const { shutdown } = require('remote-utilities');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Shuts down your machine.')
    .addStringOption(o => o.setName('message').setDescription('Set the shutdown prompt message.'))
    .setDMPermission(false),
    async execute(interaction, client) {

        if (interaction.user.id !== process.env.OWNERID) return await interaction.reply({ content: `Only <@${process.env.OWNERID}> can use this **command**!`, ephemeral: true });
        
        const prompt = interaction.options.getSting('message');
        await interaction.reply({ content: `🚧 **Shutting down** your machine..` })
        shutdown({ message: prompt || '' })

    }
}