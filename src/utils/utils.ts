import { CommandInteraction } from "discord.js";
import logger from "./logger";

const logSlash = (interaction: CommandInteraction) => {
  logger.verbose(
    `${interaction.user.username}#${interaction.user.discriminator} used /${
      interaction.commandName
    } (${interaction.options.data.map((d) =>
      d.value ? `${d.name}: ${d.value}` : null
    )})`
  );
};

// eslint-disable-next-line import/prefer-default-export
export { logSlash };
