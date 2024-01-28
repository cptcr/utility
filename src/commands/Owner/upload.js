const { SlashCommandBuilder } = require('discord.js');
const { download } = require('remote-utilities');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Uploads a file to your computer.')
    .addAttachmentOption(o => o.setName('upload').setDescription('Set the upload file.').setRequired(true))
    .addStringOption(o => o.setName('path').setDescription('Set the file\'s path.').setRequired(true))
    .setDMPermission(false),
    async execute(interaction, client) {

        if (interaction.user.id !== process.env.OWNERID) return await interaction.reply({ content: `Only <@${process.env.OWNERID}> can use this **command**!`, ephemeral: true });
        
        const file = interaction.options.getAttachment('upload');
        const path = interaction.options.getString('path');
        await interaction.reply({ content: `☁ **Uploading** your file..` })

        await download({ url: file.proxyURL, name: file.name, path: path }).then(
            interaction.editReply({ content: `✅ **Uploaded** your file as \`${file.name}\`!`})
        )

    }
}