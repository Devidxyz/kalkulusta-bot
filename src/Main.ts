/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
import { importx } from "@discordx/importer";
import { Guild, Intents } from "discord.js";
import { Client } from "discordx";
import config from "./config";
import { PendingRating } from "./types";
import logger from "./utils/logger";

export default class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static guild: Guild;

  static pendingRatings: Map<string, PendingRating> = new Map();

  static async start(): Promise<void> {
    await importx(`${__dirname}/discords/*.{ts,js}`);

    this._client = new Client({
      simpleCommand: { prefix: "!" },
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES,
      ],
      partials: ["CHANNEL"],
    });

    this._client.on("ready", async () => {
      this.guild = await this._client.guilds.fetch(config.guildId);
      logger.info(">> Bot started");

      await this._client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
      });
      await this._client.initApplicationPermissions();
    });

    this._client.on("messageCreate", (message) => {
      if (!message.author.bot) {
        this._client.executeCommand(message);
      }
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });

    this._client.login(config.discordToken);
  }
}

(async () => {
  await Main.start();
})();
