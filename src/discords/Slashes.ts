/* eslint-disable class-methods-use-this */
import { CommandInteraction, MessageOptions } from "discord.js";
import { Discord, Slash } from "discordx";
import { getCharactersReply, getRestartRatingPayload } from "../core";
import Main from "../Main";
import { STATUS } from "../static";
import { getRatingStatus, logSlash } from "../utils/utils";

@Discord()
abstract class Slashes {
  @Slash({
    name: "ping",
    description: "Get the latency of the bot and the discord API.",
  })
  async ping(interaction: CommandInteraction) {
    logSlash(interaction);
    await interaction.reply(
      `Latency is ${
        Date.now() - interaction.createdTimestamp
      }ms. API Latency is ${Math.round(Main.Client.ws.ping)}ms`
    );
  }

  @Slash({
    name: "help",
    description: "Használati útmutató",
  })
  async help(interaction: CommandInteraction) {
    logSlash(interaction);
    await interaction.reply("help");
  }

  @Slash({
    name: "start",
    description: "Kezdj el egy értékelést",
  })
  async start(interaction: CommandInteraction) {
    logSlash(interaction);

    if (!interaction.channel.isDMBased()) {
      const user = await Main.Client.users.fetch(interaction.user.id);
      const directMessage = await user.send(
        getRestartRatingPayload() as MessageOptions
      );
      await interaction.reply({
        content: `Folytassuk privátban ${directMessage.url}`,
        ephemeral: true,
      });
      return;
    }

    const pendingRating = Main.pendingRatings.get(interaction.user.id);
    const status = await getRatingStatus(pendingRating);

    if (status !== STATUS.EMPTY) {
      await interaction.reply(getRestartRatingPayload());
      return;
    }

    await interaction.reply(getCharactersReply());
  }
}

export default Slashes;
