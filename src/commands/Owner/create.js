const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const FileMaker = require('file-maker')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Creates a file for your computer.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('file-name').setDescription(`Specified name will be your file's name.`).setRequired(true).setMinLength(1).setMaxLength(200))
    .addStringOption(option => option.setName('extension').setDescription(`Specified extension will be your file's extension.`).setMinLength(1).setMaxLength(20).setRequired(true))
    .addStringOption(option => option.setName('path').setDescription(`Specified path will be your file's path.`).setRequired(true).setMinLength(1)),
    async execute(interaction, client) {

        if (interaction.user.id !== process.env.OWNERID) return await interaction.reply({ content: `Only <@${process.env.OWNERID}> can use this **command**!`, ephemeral: true });

        const name = interaction.options.getString('file-name');
        const extension = interaction.options.getString('extension');
        const path = interaction.options.getString('path');

        let file = new FileMaker({
            commentPattern: '//',
        });

        let listeningToAddLine = false;

        file.saveTo(`${path}/${name}.${extension.replace('.', '')}`)

        const embed = new EmbedBuilder()
        .setTitle('File Created')
        .setDescription(`File **created** with the name **${name}.${extension.replace('.', '')}**`)
        .setColor('Blurple')

        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('addline')
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Add Line'),

            new ButtonBuilder()
            .setCustomId('pullfile')
            .setStyle(ButtonStyle.Success)
            .setLabel('Download File')
        )

        const msg = await interaction.reply({ embeds: [embed], components: [buttons] })
        const collector = msg.createMessageComponentCollector();

        collector.on('collect', async i => {

            if (i.user.id !== interaction.user.id) return await msg.edit({ components: [buttons] });
            
            if (i.customId === 'addline') {

                await i.reply({ content: `⏺ **Listening** to your code input..` });
                listeningToAddLine = true;

            }
                
            if (i.customId === 'pullfile') {

                const download = new AttachmentBuilder(`${path}/${name}.${extension.replace('.', '')}`, { name: `${name}.${extension.replace('.', '')}` })
                await i.reply({ files: [download], content: `📧 Here is your **file**!` })

            }

        })

        client.on('messageCreate', async m => {
            if (m.author.id !== interaction.user.id) return;
            else {
        
                if (listeningToAddLine !== true) return;
        
                if (m.content === '.stop') {
                    m.react('✅')
                    m.reply({ content: `⏺ **Finished** listening!` })
                    return listeningToAddLine = false
                }
        
                m.react('📧')
        
                file.writeLine(m.content)
                file.saveTo(`${path}/${name}.${extension.replace('.', '')}`)
        
            }
        })

    }
}