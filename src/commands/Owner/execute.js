const { SlashCommandBuilder } = require('discord.js');
const exec = require('child_process').exec;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('execute')
    .setDescription('Executes a console command.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('command').setDescription(`Specified command will be ran.`).setRequired(true).setMinLength(1)),
    async execute(interaction, client) {

        if (interaction.user.id !== process.env.OWNERID) return await interaction.reply({ content: `Only <@${process.env.OWNERID}> can use this **command**!`, ephemeral: true });

        const command = interaction.options.getString('command');

        try {
            exec(command)
        } catch (err) { console.log(err); return await interaction.reply({ content: `❌ **Couldn't** execute your command!` })}
       
        await interaction.reply({ content: `⚙ **Executed** your command \`${command}\`!`});

    }
}