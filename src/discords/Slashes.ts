/* eslint-disable class-methods-use-this */
import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import { Discord, Slash } from "discordx";
import { pingCommand, startCommand } from "../logic/commands";
import { refreshSummaryMessage } from "../logic/summary";
import logger from "../utils/logger";
import { logSlash } from "../utils/utils";

@Discord()
abstract class Slashes {
  @Slash({
    name: "ping",
    description: "Get the latency of the bot and the discord API.",
  })
  async ping(interaction: CommandInteraction) {
    try {
      logSlash(interaction);
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
      logSlash(interaction);
      await startCommand(interaction);
    } catch (error) {
      logger.error("start command interaction failed");
      logger.error(error);
    }
  }

  @Slash({
    name: "refresh",
    description: "Összesítő üzenet frissítése (moderátoroknak)",
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
  })
  async refresh(interaction: CommandInteraction) {
    try {
      logSlash(interaction);
      await refreshSummaryMessage(interaction.channel);
      await interaction.reply({ content: "done", ephemeral: true });
    } catch (error) {
      logger.error("refresh command interaction failed");
      logger.error(error);
    }
  }
}

export default Slashes;
