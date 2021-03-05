# Creating A Simple Ping Pong Command

Basic Ping Pong Command.

```js
/**
* This will allow the bot to reply "Pong!" when someone trigger its command called "!ping".
*/

// Requiring Iris Module
const Iris = require("iris.me");

// Create An Instance Of Iris Command Client
const client = new Iris.CommandClient("BOT_TOKEN", { prefix: "!"}); // Replace "BOT_TOKEN" With Your Bot's Token And Prefix Can Be Your Choice

// Start To Create A Command
client.add({
    // The Command's Name
    name: "ping",
    // Run Out The Command
    run: async (message, args) => {
        // Return "Pong!" When Someone Execute This Command And Will Return In The Current Channel Of The User
        message.channel.createMessage("Pong!");
    }
});

// Connect The Bot To Discord
client.run().then(console.log("Bot Is Ready!"))

```