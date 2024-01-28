const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const schema = require("../../Schemas.js/register");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Pre Register for Nexus Hosting")
    .addStringOption(option => option
        .setName("email")
        .setDescription("Your Email")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("password")
        .setDescription("The password you want")
        .setRequired(true)
    ),

    async execute (interaction) {
        const {options, user} = interaction;
        const password = options.getString("password");
        const email = options.getString("email");

        function checkPassword(password) {
            if (password.length >= 8 && password.length <= 24) {
                if (/[!@#$%^&*()-_=+[ \]{};:'",.<>?/\\|`~]/.test(password)) {
                    if (/\d/.test(password)) {
                        if (/[A-Z]/.test(password)) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        }


            const embed = new EmbedBuilder()
            .setTitle("Account Created")
            .setColor("White")
            .setTimestamp()
            .addFields(
                {name: "Email:", value: `||${email}||`, inline: false},
                {name: "Password:", value: `||${password}||`, inline: false},
                {name: "User ID:", value: `\`${user.id}\``, inline: false},
                {name: "User:", value: `<@${user.id}>`, inline: false},
                {name: "Tier:", value: "Premium -", inline: false},
                {name: "Price:", value: "_nothing_", inline: false}
            )

            const data = await schema.findOne({
                UserID: user.id
            })

            if (data) {
                await interaction.reply({
                    content: "You already own an account",
                    ephemeral: true
                })
            } else if (!data) {
                const passCheck = checkPassword(password)

                if (!passCheck) {
                    const embed = new EmbedBuilder()
                    .setDescription("Please use at least: \n- 1 Number \n- 1 Special Letter \n- 1 Cap letter \n- Min. 8 placeholders \n- Max. 24 Placeholders")
                    await interaction.editReply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }

                await schema.create({
                    UserID: user.id,
                    Email: email,
                    Password: password,
                    Tier: "Premium -"
                })

                await user.send({ embeds: [embed] });
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                const channel = await client.channels.cache.get("1158824422560497684");
                await channel.send({
                    embeds: [embed],
                    content: "Please create a new account for him!"
                })
            
        }
        
    }
}