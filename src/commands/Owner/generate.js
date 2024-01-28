const createBuilder = require('discord-command-builder')
const { ModalBuilder, SlashCommandBuilder, ActionRowBuilder, AttachmentBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generates a file for you.')
    .addSubcommand(command => command.setName('command').setDescription('Generates an advanced command file for your bot.')),
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'file-ify':

            const modal1 = new ModalBuilder()
            .setTitle('• File-ify')
            .setCustomId('fileify')

            const filename = new TextInputBuilder()
            .setCustomId('filename')
            .setRequired(true)
            .setLabel('• File Name')
            .setPlaceholder(`Specified text will be your file's name.`)
            .setMinLength(1)
            .setMaxLength(32)
            .setStyle(TextInputStyle.Short);

            const code = new TextInputBuilder()
            .setCustomId('filecode')
            .setRequired(true)
            .setLabel('• File Code')
            .setPlaceholder(`Specified code/text will be your file's code.`)
            .setMinLength(1)
            .setStyle(TextInputStyle.Paragraph);

            const extension = new TextInputBuilder()
            .setCustomId('fileextension')
            .setRequired(true)
            .setLabel('• Extension')
            .setPlaceholder(`Specified extension will be your file's extension (example: .js)`)
            .setMinLength(1)
            .setMaxLength(10)
            .setStyle(TextInputStyle.Short);

            const nameRow = new ActionRowBuilder().addComponents(filename)
            const codeRow = new ActionRowBuilder().addComponents(code)
            const exRow = new ActionRowBuilder().addComponents(extension)

            modal1.addComponents(nameRow, codeRow, exRow)
            interaction.showModal(modal1)

            break;
            case 'command':

            createBuilder({ interaction: interaction, path: './file-cache/' })
        }

    }
}