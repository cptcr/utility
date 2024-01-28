const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODBURL;
const { ActivityType, EmbedBuilder, Embed } = require(`discord.js`);
mongoose.set('strictQuery', false);
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        console.log('Ready!');
        //MONGODB Check
        if (!mongodbURL) return console.log("Error: Cannot find MongodbURL. File: *.env*");
        await mongoose.connect(mongodbURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        if (mongoose.connect) {
            console.log("Connected with MONGODB: True");
        } else {
          console.log("Connected with MONGODB: False");
        }
      //RPC
      let status = [
        {
         name: `NEXUS`,
         type: ActivityType.Competing,
        },
      ];
      console.log(`Enabling RPC...`);
      setInterval(() => {
       let random = Math.floor(Math.random() * status.length);
       client.user.setActivity(status[random]);
      }, `2500`);
      console.log("Successfully enabled RPC");
    },
};