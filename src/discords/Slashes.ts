/* eslint-disable class-methods-use-this */
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { pingCommand, startCommand } from "../logic/commands";
import logger from "../utils/logger";

@Discord()
abstract class Slashes {
  @Slash({
    name: "ping",
    description: "Get the latency of the bot and the discord API.",
  })
  async ping(interaction: CommandInteraction) {
    try {
      await pingCommand(interaction);
    } catch (error) {
      logger.error("ping command interaction failed");
      logger.error(error);
    }
  }

  @Slash({
    name: "start",
    description: "Kezdj el egy értékelést",
  })
  async start(interaction: CommandInteraction) {
    try {
      await startCommand(interaction);
    } catch (error) {
      logger.error("start command interaction failed");
      logger.error(error);
    }
  }
}

export default Slashes;
