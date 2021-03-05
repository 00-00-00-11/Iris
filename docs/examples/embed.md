# Creaing An Embed

This Will Allow The Bot To Send An Embed With Specific Value In It.

```js

// Requiring Iris Module
const Iris = require("iris.me");

// Create An Instance Of Iris Command Client
const client = new Iris.CommandClient("BOT_TOKEN", { prefix: "!" }); // Replace "BOT_TOKEN" With Your Bot's Token And Prefix Is Your Choice

// Start Creating A Command
client.add({
    // The Command's Name
    name: "embed",
    run: async (message, args) => {
        // Creating A Variables For The Embed

        // Creating An Embed's Constructor
        let Embed = new Iris.Utils.Embed()
            .setTitle("Your Title")
            .setDescription("Description With Some Lovely Words")
            .setColor(0xFF4545)
            .setFooter("Made 💖 With Iris")

            // Sending The Embed
            message.channel.createMessage({ embed: Embed }) 
    }
});

// Connect The Bot To Discord
client.run().then(console.log("Bot Is Ready!"));

```