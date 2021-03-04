# Iris

A NodeJS Wrapper Designed Easily To Interact With The Discord API. Pure Built In **TypeScript**.

- **API Docs** - Soon!

---

# Getting Started 

Before You Start, Please Note That **Iris** Is Operated Within The Specific Clients Classes:

- `ShardClient` - Provides A Client Base For Connecing & Running To The Discord API.
- `ClusterClient` - Provides The Client To Spawn `ShardClient` Class Inside It For Easier Interaction & Sharding.
- `CommandClient` - Basic Class Which Provides Support For Client's Commands.
- `ClusterManager` - Provides A Cluster Manager That'll Spawn Multiple `ClusterClient` Process For Big Shardings.

## CommandClient Class

```js

const Iris = require("iris.me");

const client = new Iris.CommandClient("BOT_TOKEN", { prefix: "!"});

// Creating Commands
client.add({
    // Describe The Command Name
    name: "ping",
    /**
     * @param {Iris.Command.Context} message
     * @param {String[]} args
     */
    run: async (message, args) => {
        message.channel.createMessage("Pong!");
    }
})

// Creating Embeds
client.add({
    name: "embed",
    /**
     * @param {Iris.Command.Context} message
     * @param {String[]} args
     */
    run: async (message, args) => {
        let embed = new Iris.Utils.Embed() // Embed's Constructor.
        .setTitle("Title Here")
            .setThumbnail(message.user.avatarUrl)
            .setDescription("Description With More Describing Words.")
            .setFooter("Made With Iris")
            .setColor(0xFF4545)

            message.channel.createMessage({ embed: embed }) // Sending The Embed.
    }
})

// Connecting To Discord
client.run().then(console.log("I'm Ready To Go!"));

```

## ShardClient Class

```js

const Iris = require("iris.me");
const client = new Iris.ShardClient("BOT_TOKEN", { gateway: { loadAllMembers: true}});
const prefix = "!";

client.on("guildCreate", async ({guild}) => {
    console.log(`Joined Server: ${guild.name}.`);
})

client.on("messageCreate", async ({message}) => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        message.channel.createMessage("Pong!");
    }
});

client.run().then(console.log("Ready!"))

```

## ClusterClient Class

```js

const Iris = require("iris.me")
const client = new Iris.ClusterClient("BOT_TOKEN", {
    gateway: {
        presence: {
            activity: {
                name: "Iris Library",
                type: 0,
            },
            status: "idle"
        },
    },
});

client.on("guildCreate", async ({guild, shard}) => {
        console.log(`[Shard - ${shard.shardId}] Joined New Guild: ${guild.name}`);
});

const prefix = "!"

client.on("messageCreate", async ({message}) => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        message.channel.createMessage("Pong!");
    }
});

client.run().then(console.log("Ready!"))

```

---

# Why Choose Iris?

- Speedy
- Lightweight
- Consistent
- Up-To-Date
- Stable
- Accurate Typings

We've Got What You Want! **Iris** Is Designed To Be All In One, This Includes Sharding Method & Also Cluster Manager.

---

# Installation

```

$ npm i iris.js

```

```

$ yarn add iris.js

```

---

# Getting Help

- Soon™ For **Iris Discord Server Support**!

---
