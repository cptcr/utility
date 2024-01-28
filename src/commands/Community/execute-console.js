const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { reboot } = require("remote-utilities/src/index");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("console")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Execute a command in the console")
    .addStringOption(option => option
        .setName("command")
        .setDescription("The command")
        .setRequired(true)
        .addChoices(
            {name: "Shutdown", value: "process.kill()"},
            {name: "Clear", value: "console.clear"},
            {name: "Time", value: "console.time()"},
            {name: "Debug", value: "console.debug()"},
            {name: "Hello World", value: `console.log("Hello World")`},
            {name: "Restart", value: "restart"}
        )
    ),

    async execute (interaction) {
        const input = interaction.options.getString("command");

        await interaction.reply({
            content: `\`${input}\` has been executed successfull`,
            ephemeral: true
        })

        
        if (input === "console.clear") await console.clear;
        if (input === "process.exit()") await process.exit();
        if (input === "console.time()") {
            await console.time();
            await console.timeEnd();
        }
        if (input === "console.debug()") await console.debug();
        if (input === `console.log("Hello World")`) await console.log("Hello World"); 
        if (input === "restart") {
            reboot({ message: input || 'Hello World' })
        }
    }
}