const { AttachmentBuilder, MessageType ,Client, Partials, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, MessageCollector, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Integration } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildScheduledEvents
    ],
    partials: [
        Partials.Channel, 
        Partials.Reaction, 
        Partials.Message,
        Partials.GuildMember,
    ],
    allowedMentions: {
    parse: [`users`, `roles`],
    repliedUser: true,
    }
}); 
client.commands = new Collection();
require('dotenv').config();
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
//Anti Crash System
const process = require("node:process");
const mainGuild = process.env.MAINGUILDID;
const owner = process.env.OWNERID;
const justin = process.env.JUSTIN;
process.on('unhandledRejection', async (reason, promise) => {
    console.log("unhandled rejection at:", promise, 'reason:', reason)
});
process.on('uncaughtException', (err) => {
        console.log("Uncaught Exception:", err);
});
process.on('uncaughtExceptionMonitor', (err, origin) => { 
        console.log("Uncaught Exception Monitor:", err);  
});
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();
//welcome
client.on(Events.GuildMemberAdd, async (member) => {
    if (member.guild.id !== "1121353922355929129") return;
    const welcomeChannel = client.channels.cache.get("1121353924339847301");
    const message = await welcomeChannel.send({
        content: `Welcome ${member} to Nexus!`
    });
    await message.react("👋")
})
// MODMAIL CODE //
const moduses = require("./Schemas.js/modmailuses");
const modschema = require("./Schemas.js/modmailschema");
client.on(Events.MessageCreate, async message => {

    if (message.guild) return;
    if (message.author.id === client.user.id) return;
    
    const usesdata = await moduses.findOne({ User: message.author.id });

    if (!usesdata) {

        message.react('👋')

        const modselect = new EmbedBuilder()
        .setColor("White")
        .setAuthor({ name: `📞 Modmail System`})
        .setFooter({ text: `📞 Modmail Selecion`})
        .setTimestamp().setDescription("You created a modmail!")
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('selectmodmail')
            .setLabel('• Reason')
            .setStyle(ButtonStyle.Secondary)
        )     

        const msg = await message.reply({ embeds: [modselect], components: [button] });
        const selectcollector = msg.createMessageComponentCollector();

        selectcollector.on('collect', async i => {

            if (i.customId === 'selectmodmail') {

                const selectmodal = new ModalBuilder()
                .setTitle('• Modmail Selector')
                .setCustomId('selectmodmailmodal')

                const subject = new TextInputBuilder()
                .setCustomId('subject')
                .setRequired(true)
                .setLabel(`• What's the reason for contacting us?`)
                .setPlaceholder(`Example: "I wanted to bake some cookies, but JASO0ON didn't let me!!!"`)
                .setStyle(TextInputStyle.Paragraph);
                const subjectrow = new ActionRowBuilder().addComponents(subject)

                selectmodal.addComponents(subjectrow)

                i.showModal(selectmodal)

            }
        })

    } else {

        if (message.author.bot) return;

        const sendchannel = await client.channels.cache.get(usesdata.Channel);
        if (!sendchannel) {

            message.react('⚠')
            await message.reply('**Oops!** Your **modmail** seems **corrupted**, we have **closed** it for you.')
            return await moduses.deleteMany({ User: usesdata.User });

        } else {

            const msgembed = new EmbedBuilder()
            .setColor("White")
            .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
            .setFooter({ text: `📞 Modmail Message - ${message.author.id}`})
            .setTimestamp()
            .setDescription(`${message.content || `**No message provided.**`}`)

            if (message.attachments.size > 0) {

                try {
                    msgembed.setImage(`${message.attachments.first()?.url}`);
                } catch (err) {
                    return message.react('❌')
                }

            }

            const user = await sendchannel.guild.members.cache.get(usesdata.User)
            if (!user) {
                message.react('⚠️')
                message.reply(`⚠️ You have left **${sendchannel.guild.name}**, your **modmail** was **closed**!`)
                sendchannel.send(`⚠️ <@${message.author.id}> left, this **modmail** has been **closed**.`)
                return await moduses.deleteMany({ User: usesdata.User })
            }

            try {
                await sendchannel.send({ embeds: [msgembed] });
            } catch (err) {
                return message.react('❌')
            }
            
            message.react('📧')
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'selectmodmailmodal') {

        const data = await moduses.findOne({ User: interaction.user.id });
        if (data) return await interaction.reply({ content: `You have **already** opened a **modmail**! \n> Do **/modmail close** to close it.`, ephemeral: true });
        else {

            const serverid = "1121353922355929129";
            const subject = interaction.fields.getTextInputValue('subject');

            const server = await client.guilds.cache.get(serverid);
            if (!server) return await interaction.reply({ content: `**Oops!** It seems like that **server** does not **exist**, or I am **not** in it!`, ephemeral: true });
            
            const executor = await server.members.cache.get(interaction.user.id);
            if (!executor) return await interaction.reply({ content: `You **must** be a member of **${server.name}** in order to **open** a **modmail** there!`, ephemeral: true});

            const modmaildata = await modschema.findOne({ Guild: server.id });
            if (!modmaildata) return await interaction.reply({ content: `Specified server has their **modmail** system **disabled**!`, ephemeral: true});
            
            const channel = await server.channels.create({
                name: `modmail-${interaction.user.id}`,
                parent: modmaildata.Category,

            }).catch(err => {
                return interaction.reply({ content: `I **couldn't** create your **modmail** in **${server.name}**!`, ephemeral: true});
            })
    
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });

            const embed = new EmbedBuilder()
            .setColor("White")
            .setAuthor({ name: `📞 Modmail System`})
            .setFooter({ text: `📞 Modmail Opened`})
            .setTimestamp()
            .setTitle(`> ${interaction.user.username}'s Modmail`)
            .addFields({ name: `• Subject`, value: `> ${subject}`})

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('deletemodmail')
                .setEmoji('❌')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId('closemodmail')
                .setEmoji('🔒')
                .setLabel('Close')
                .setStyle(ButtonStyle.Secondary)
            )
        
            await moduses.create({
                Guild: server.id,
                User: interaction.user.id,
                Channel: channel.id
            })
            
            await interaction.reply({ content: `Your **modmail** has been opened in **${server.name}**!`, ephemeral: true});
            const channelmsg = await channel.send({ embeds: [embed], components: [buttons] });
            channelmsg.createMessageComponentCollector();

        }
    }
})

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.customId === 'deletemodmail') {

        const closeembed = new EmbedBuilder()
        .setColor("White")
        .setAuthor({ name: `📞 Modmail System`})
        .setFooter({ text: `📞 Modmail Closed`})
        .setTimestamp()
        .setTitle('> Your modmail was Closed')
        .addFields({ name: `• Server`, value: `> ${interaction.guild.name}`})

        const delchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
        const userdata = await moduses.findOne({ Channel: delchannel.id });

        await delchannel.send('❌ **Deleting** this **modmail**..')

        setTimeout(async () => {

            if (userdata) {

                const executor = await interaction.guild.members.cache.get(userdata.User)
                if (executor) {
                    await executor.send({ embeds: [closeembed] });
                    await moduses.deleteMany({ User: userdata.User });
                }

            }

            try {
                await delchannel.delete();
            } catch (err) {
                return;
            }
            
        }, 100)

    }

    if (interaction.customId === 'closemodmail') {

        const closeembed = new EmbedBuilder()
        .setColor("White")
        .setAuthor({ name: `📞 Modmail System`})
        .setFooter({ text: `📞 Modmail Closed`})
        .setTimestamp()
        .setTitle('> Your modmail was Closed')
        .addFields({ name: `• Server`, value: `> ${interaction.guild.name}`})

        const clchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
        const userdata = await moduses.findOne({ Channel: clchannel.id });

        if (!userdata) return await interaction.reply({ content: `🔒 You have **already** closed this **modmail**.`, ephemeral: true})

        await interaction.reply('🔒 **Closing** this **modmail**..')

        setTimeout(async () => {
            
            const executor = await interaction.guild.members.cache.get(userdata.User)
            if (executor) {

                try {
                    await executor.send({ embeds: [closeembed] });
                } catch (err) {
                    return;
                }
                
            }

            interaction.editReply(`🔒 **Closed!** <@${userdata.User}> can **no longer** view this **modmail**, but you can!`)

            await moduses.deleteMany({ User: userdata.User });

        }, 100)

    }
})

client.on(Events.MessageCreate, async message => {

    if (message.author.bot) return;
    if (!message.guild) return;

    const data = await modschema.findOne({ Guild: message.guild.id });
    if (!data) return;

    const sendchanneldata = await moduses.findOne({ Channel: message.channel.id });
    if (!sendchanneldata) return;

    const sendchannel = await message.guild.channels.cache.get(sendchanneldata.Channel);
    const member = await message.guild.members.cache.get(sendchanneldata.User);
    if (!member) return await message.reply(`⚠ <@${sendchanneldata.User} is **not** in your **server**!`)

    const msgembed = new EmbedBuilder()
    .setColor("White")
    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
    .setFooter({ text: `📞 Modmail Received - ${message.author.id}`})
    .setTimestamp()
    .setDescription(`${message.content || `**No message provided.**`}`)

    if (message.attachments.size > 0) {

        try {
            msgembed.setImage(`${message.attachments.first()?.url}`);
        } catch (err) {
            return message.react('❌')
        }

    }

    try {
        await member.send({ embeds: [msgembed] });
    } catch (err) {
        message.reply(`⚠ I **couldn't** message **<@${sendchanneldata.User}>**!`)
        return message.react('❌')
    }
            
    message.react('📧')

})

//report user
const reportSchema = require("./Schemas.js/report");
const blacklist = require("./Schemas.js/blacklist");
client.on("interactionCreate", async i => {
    try {
    if (i.customId === "ghjja") {
        if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) await i.reply({ content: "You are not allowed to do this action!"});
        const data = await reportSchema.findOne({
            Guild: i.guild.id,
            Message: i.message.id,
        });

        if (data) {
            await i.reply({
                content: `<@${data.Target}> has added to the blacklist!`,
                ephemeral: true
            });

            const sendEmbed = new EmbedBuilder()
            .setDescription(`Your report has been accepted by ${i.user}! Thanks for submitting that.`)
            .addFields(
                {name: "Target:", value: `<@${data.Target}>`, inline: false},
                {name: "Reason:", value: data.Reason, inline: false}
            )
            .setFooter({ text: "Nexus Utility System"})
            .setColor("White")

            const memberSend = await client.users.cache.get(data.User);

            await memberSend.send({ embeds: [sendEmbed] }).catch(err => {
                return;
            })

            await i.update({ components: [] });

            const banMember = await client.users.cache.get(data.Target).catch(err => {
                i.reply({
                    content: `I cannot find <@${data.Target}>!`,
                    ephemeral: true
                })
            });

            const blacklistData = await blacklist.findOne({
                User: data.Target,
            });

            if (blacklistData) {
                await i.reply({
                    content: "This user has already been blacklisted!",
                    ephemeral: true
                })
            } else {
                blacklist.create({
                    User: data.Target,
                    Moderator: i.user,
                    Reason: data.Reason
                })
            }
        }
    }
    

    if (i.customId === "slslaa" ) {
            
        if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) await i.reply({ content: "You are not allowed to do this action!"});
        const data = await reportSchema.findOne({
            Guild: i.guild.id,
            Message: i.message.id,
        });

        if (data) {
            await i.reply({
                content: `Rejected!`,
                ephemeral: true
            });

            const sendEmbed = new EmbedBuilder()
            .setDescription(`Your report has been rejected by ${i.user}!`)
            .addFields(
                {name: "Target:", value: `<@${data.Target}>`, inline: false},
                {name: "Reason:", value: data.Reason, inline: false}
            )
            .setFooter({ text: "Nexus Utility System"})
            .setColor("White")

            const memberSend = await client.users.cache.get(data.User);

            await memberSend.send({ embeds: [sendEmbed] }).catch(err => {
                return;
            })

            await i.update({ components: [] });

            await reportSchema.deleteOne({
                Guild: i.guild.id,
                Target: data.Target,
                Reason: data.Reason,
            })
        }
    }
  } catch (err) {
    return;
  }
})
/*
client.on(Events.GuildMemberAdd, async (member) => {
    const ROLE_ID = "1121354341647921182";
    if (member.id = "1026202482214440991") return;
    if (member.guild.id !== "1121353922355929129") return;
    const role = await member.guild.roles.cache.get(ROLE_ID).catch(err => {
        return;
    });
    if (!role) return;
    if (role) {
        if (!member.roles.cache.has(ROLE_ID)) {
            await member.roles.add(role).catch(err => { return; });
        } else {
            return;
        }
    }
}); */

client.on(Events.GuildMemberAdd, async (member) => {
    if (member.guild.id !== "1121353922355929129") return;
    const name = member.user.username;

    const newName = `${name}.json`;

    await member.setNickname(newName);
})

client.on(Events.InteractionCreate, async (i, interaction) => {
    if (i.customId === "applicate") {

        const id = new TextInputBuilder()
        .setCustomId('bot-id')
        .setRequired(true)
        .setLabel(`Bot ID:`)
        .setPlaceholder(`Example: 1046468420037787720`)
        .setStyle(TextInputStyle.Paragraph);

        const url = new TextInputBuilder()
        .setCustomId('bot-url')
        .setRequired(true)
        .setLabel("Invite URL:")
        .setStyle(TextInputStyle.Paragraph)

        const features = new TextInputBuilder()
        .setCustomId("bot-features")
        .setRequired(true)
        .setLabel("Bot Features:")        
        .setStyle(TextInputStyle.Paragraph)



        const subjectrow = new ActionRowBuilder().addComponents(id, url, features)
        
        const modal = new ModalBuilder()
        .setCustomId("app-modal")
        .setTitle("Application Form")
        .addComponents(subjectrow)

        await i.showModal(modal)

        const channelID = "1150484189532143616";
        const channel = client.channels.cache.get(channelID)
    }
})

const whitelist = require('./Schemas.js/ping-whitelist');
const { parseArgs } = require('util');
//anti staff ping
client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

    const toowake = await client.users.cache.get("931870926797160538");
    const yustin = await client.users.cache.get("822111322548076624");
    const jasondev = await client.users.cache.get("759037138929975297");
    const verox = await client.users.cache.get("429956721084203008");
    const data = whitelist.find({ User: message.author.id})
    const usersArray = [
        toowake,
        yustin,
        jasondev,
        verox
    ]

    const author = message.author;

    if (data) {
        return;
    }

    const mentions1 = message.mentions.users.first();

    if (usersArray.includes(mentions1)) {
        if (usersArray.includes(author)) {
            return;
        };


        const embed = new EmbedBuilder()
        .setTitle(`You pinged ${mentions1.username}`)
        .setDescription(`Please dont ping ${mentions1} :) \nThanks`)
        .setColor("White")

        const embed1 = new EmbedBuilder()
        .setTitle("You have been pinged")
        .setColor("White")
        .addFields(
            {name: "User:", value: `${author}`, inline: false},
            {name: "User ID:", value: `\`${author.id}\``, inline: false},
            {name: "Message:", value: `${message.content}`, inline: false},
            {name: "Channel:", value: `${message.channel}`, inline: false},
            {name: "Server:", value: `${message.guild.name}`, inline: false}
        )

        await mentions1.send({
            embeds: [embed1]
        })

        await message.author.send({
            embeds: [embed]
        })



        await message.delete()
    } 
})



function convert(timeString) {
    const lastChar = timeString.slice(-1);
    const numericValue = parseFloat(timeString);
  
    // Define conversion factors
    const secondsToMilliseconds = 1000; 
    const minutesToMilliseconds = 60 * secondsToMilliseconds; 
    const hoursToMilliseconds = 60 * minutesToMilliseconds; 
    const daysToMilliseconds = 24 * hoursToMilliseconds; 
  
    
    if (lastChar === 'd') {
      return numericValue * daysToMilliseconds;
    } else if (lastChar === 'h') {
      return numericValue * hoursToMilliseconds;
    } else if (lastChar === 'm') {
      return numericValue * minutesToMilliseconds;
    } else if (lastChar === 's') {
      return numericValue * secondsToMilliseconds;
    } else {
      throw new Error("Invalid time format. Use '1d' for days, '1h' for hours, '1m' for minutes, or '1s' for seconds.");
    }
}

client.on("messageCreate", async (message) => {
    const prefix = "sudo ";

    //const command = message.content.split(prefix);

    const {content, author, guild, channel, member, mentions } = message;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (message.content.startsWith(prefix)) {
        if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
            return;
        } else {
            if (cmd === "ban") {
                const banMember = mentions.users.first();

                if (!banMember) {
                    return;
                }

                const embed = new EmbedBuilder()
                .setTitle(`Ban added`)
                .setDescription(`I have banned ${banMember} successfull!`)
                .setColor("White")
                .setTimestamp()

                await guild.bans.create(banMember);

                await message.reply({
                    embeds: [embed]
                });
            }

            if (cmd === "timeout") {
                const toMember = mentions.users.first();

                let duration = args[1];
                let reason = args[2-25];

                if (!toMember) return;
                if (!duration) return;

                const embed = new EmbedBuilder()
                .setTitle(`Timeout added`)
                .setDescription(`I have timeouted ${toMember} successfull! \n**Duration:** \`${duration}\` \n**Milliseconds:** \`${convert(duration)}\` \n**Reason:** ${reason}`)
                .setColor("White")
                .setTimestamp()

                //await toMember.timeout(duration)

                await message.reply({
                    embeds: [embed]
                })
            }
        }
    } else {
        return;
    }
})

var count = 0;
setInterval(async () => {
    count++;
    console.log("Date check done:", count)

    const channelID = "1121362113995218976";
    const channel = client.channels.cache.get(channelID);
    
    if (Date.now() === Date.parse("October 31, 2023 00:00:00")) {
        const embed = new EmbedBuilder()
        .setTitle("Happy Halloween everyone!")
        .setDescription("Today is Halloween so there is a new coupon!")
        .setColor("Orange")
        .addFields(
            {name: "Coupon:", value: "HALLOWEEN2023", inline: false},
            {name: "Coins:", value: "500", inline: false}
        )
        .setImage("https://hips.hearstapps.com/hmg-prod/images/pumpkin-carving-64ee2cfe412b7.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*")
        .setThumbnail("https://static.scientificamerican.com/sciam/cache/file/0842D3CA-DCFF-4964-ACB76ACD4607C3EB_source.jpg?w=590&h=800&5C765018-2E2A-4130-979AEC29A7FB3A2C")
        .setURL("https://panel.gnexus.online/account/coupons")
        .setFooter("Happy Halloween from the Nexus Staff Team!")
        .setTimestamp()
    
        await channel.send({
            content: "@everyone",
            embeds: [embed]
        })
    }
    
    if (new Date().getDate() === 31 && new Date().getMonth() === 11 && new Date().getFullYear() === 2023) {
        const guild = client.guilds.cache.get("1121353922355929129");
    
        await guild.setBanner("https://nexus-hosting.tech/img/christmas-nexus.png")
    }
    
    if (Date.now() === Date.parse("December 24, 2023 00:00:00")) {
        const embed = new EmbedBuilder()
        .setTitle("Merry Christmas everyone!")
        .setDescription("Today Santa Claus visited this server, so here is a new coupon!")
        .setColor("Red")
        .addFields(
            {name: "Coupon:", value: "CHRISTMAS2023", inline: false},
            {name: "Coins:", value: "500", inline: false}
        )
        .setImage("https://nexus-hosting.tech/img/christmas-nexus.png")
        .setThumbnail("https://nexus-hosting.tech/img/image_2023-10-30_165639114.png")
        .setURL("https://panel.gnexus.online/account/coupons")
        .setFooter("Your Nexus Staff Team!")
        .setTimestamp()
    
        await channel.send({
            content: "@everyone",
            embeds: [embed]
        })
    }
    
    if (Date.now() === Date.parse("January 01, 2024 00:00:00")) {
        const guild = client.guilds.cache.get("1121353922355929129");
    
        await guild.setBanner("https://static.tnn.in/photo/msid-96649734/96649734.jpg")
    
        await channel.send({
            content: "# HAPPY NEW YEAR FROM GERMANY @everyone"
        });
    }
}, 60 * 1000)


const broSchema = require("./Schemas.js/brocount")

client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    const { author, content } = message; 

    const dataBro = await broSchema.findOne({
        User: author.id,
    })

    if (content.includes("Bro") || content.includes("bro")) {
        if (dataBro) {
            dataBro.Count++;
            dataBro.save();
        } else {
            await broSchema.create({
                User: author.id,
                Count: 1,
            })
        }
    } else {
        return;
    }
})