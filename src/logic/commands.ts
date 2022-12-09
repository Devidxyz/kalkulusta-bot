import { CommandInteraction, MessageOptions } from "discord.js";
import Main from "../Main";
import { logSlash } from "../utils/utils";
import { getCharactersReply } from "./replies";

const pingCommand = async (interaction: CommandInteraction) => {
  logSlash(interaction);
  await interaction.reply(
    `Latency is ${
      Date.now() - interaction.createdTimestamp
    }ms. API Latency is ${Math.round(Main.client.ws.ping)}ms`
  );
};

const startCommand = async (interaction: CommandInteraction) => {
  logSlash(interaction);

  if (!interaction.channel.isDMBased()) {
    const user = await Main.client.users.fetch(interaction.user.id);
    const directMessage = await user.send(
      getCharactersReply() as MessageOptions
    );
    await interaction.reply({
      content: `Folytassuk privátban ${directMessage.url}`,
      ephemeral: true,
    });
    return;
  }

  Main.pendingRatings.delete(interaction.user.id);
  await interaction.reply(getCharactersReply());
};

export { pingCommand, startCommand };
