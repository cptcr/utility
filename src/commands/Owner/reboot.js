const { SlashCommandBuilder } = require('discord.js');
const { reboot } = require('remote-utilities');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Reboots your machine.')
    .addStringOption(o => o.setName('message').setDescription('Set the reboot prompt message.'))
    .setDMPermission(false),
    async execute(interaction, client) {

        if (interaction.user.id !== process.env.OWNERID) return await interaction.reply({ content: `Only <@${process.env.OWNERID}> can use this **command**!`, ephemeral: true });

        const prompt = interaction.options.getString('message');
        await interaction.reply({ content: `🚧 **Rebooting** your machine..` })
        reboot({ message: prompt || '' })

    }
}