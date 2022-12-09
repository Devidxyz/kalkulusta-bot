import { importx } from "@discordx/importer";
import { Guild, IntentsBitField, Partials, TextChannel } from "discord.js";
import { Client } from "discordx";
import config from "./config";
import { PendingRating } from "./types";
import logger from "./utils/logger";

export default class Main {
  static client: Client;

  static guild: Guild;

  static logChannel: TextChannel;

  static pendingRatings: Map<string, PendingRating> = new Map();

  static async start(): Promise<void> {
    await importx(`${__dirname}/discords/*.{ts,js}`);

    this.client = new Client({
      simpleCommand: { prefix: "!" },
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.DirectMessages,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User],
    });

    this.client.on("ready", async () => {
      this.guild = await this.client.guilds.fetch(config.guildId);
      this.logChannel = this.guild.channels.cache.find(
        (c) => c.id === config.logChannal
      ) as TextChannel;

      logger.info(">> Bot started");

      await this.client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
      });
    });

    this.client.on("messageCreate", (message) => {
      if (!message.author.bot) {
        this.client.executeCommand(message);
      }
    });

    this.client.on("interactionCreate", (interaction) => {
      this.client.executeInteraction(interaction);
    });

    this.client.login(config.discordToken);
  }
}

(async () => {
  await Main.start();
})();
