const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
    .setName('view-rep')
    .setDescription('Check the reps and highest rating a user has')
    .setDMPermission(false)
    .addUserOption(option => option.setName('user').setDescription('The user you want to rep').setRequired(true)),
    
    async execute (interaction, client) {
        const user = interaction.options.getUser('user');
        const latest_rep_reason = await db.get(`latest_reason_${user.id}`) || '`None.`'
        const reps = await db.get(`reps_${user.id}`) || 0;
        const highest_rating = await db.get(`highest_rating_${user.id}`) || '**No stars**'

        const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Rep Stats`)
        .setDescription(`**Latest reason for rep:**\n${latest_rep_reason}`)
        ///placeholder color
        .setColor('#ffffff')
        .addFields(
            { name: 'Highest Rating', value: highest_rating, inline: true},
            { name: 'Rep Count', value: `${reps} reps`, inline: true}
        )

        await interaction.reply({ embeds: [embed] })
    }
}