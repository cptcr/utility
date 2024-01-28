const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('download')
    .setDescription('Downloads specified file.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('file-name').setDescription(`Specified name will be given to your file.`).setRequired(true).setMinLength(1).setMaxLength(200))
    .addStringOption(option => option.setName('path').setDescription(`Specified path must be the downloaded file's path.`).setRequired(true).setMinLength(1)),
    async execute(interaction, client) {

        await interaction.deferReply()

        if (interaction.user.id !== process.env.OWNERID) return await interaction.reply({ content: `Only <@${process.env.OWNERID}> can use this **command**!`, ephemeral: true });

        const path = interaction.options.getString('path');
        const name = interaction.options.getString('file-name');

        const file = new AttachmentBuilder(path, { name: `${name}`})
        await interaction.editReply({ content: `📧 **Here** is your file!`, files: [file] });

    }
}