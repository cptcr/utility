const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rep')
    .setDescription('Give a rep to a user')
    .setDMPermission(false)
    .addUserOption(option => option.setName('user').setDescription('The user you want to rep').setRequired(true))
    .addNumberOption(option => option.setName('rating').setDescription('Rate the user 1-5 stars').setMinValue(1).setMaxValue(5).setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for repping this user').setMaxLength(1024)),

    async execute (interaction, client) {
        const user = interaction.options.getUser('user');
        const rating = interaction.options.getNumber('rating');
        const reason = interaction.options.getString('reason') || 'No reason.';
        const ratingStars = '⭐'.repeat(rating) 
        let highest_rating = await db.get(`highest_rating_${user.id}`) || '';
        highest_rating = highest_rating.toString();
    try{
        if (rating > highest_rating.length) {
            db.set(`highest_rating_${user.id}`, ratingStars)
        }

        db.set(`latest_reason_${user.id}`, reason)
        db.add(`reps_${user.id}`, 1)
        const embed = new EmbedBuilder()
        .setTitle(`${user.username} | +1 Rep`)
        .setDescription(`**${interaction.user}** gave ${user} +1 rep`)
         //PLACEHOLDER COLOR (WHITE)
        .setColor('#ffffff')

        .addFields(
            { name: 'Rating', value: ratingStars, inline: true},

            { name: 'Reason', value: `**${reason}**`, inline: true}
        )

        await interaction.reply({ embeds: [embed] })
    } catch (err) {
        console.log(err)
    }

    }
}