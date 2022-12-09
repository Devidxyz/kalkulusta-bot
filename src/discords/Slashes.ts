/* eslint-disable class-methods-use-this */
import { CommandInteraction, MessageOptions } from "discord.js";
import { Discord, Slash } from "discordx";
import { getCharactersReply } from "../logic/replies";
import Main from "../Main";
import { logSlash } from "../utils/utils";

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
      }ms. API Latency is ${Math.round(Main.client.ws.ping)}ms`
    );
  }

  // @Slash({
  //   name: "help",
  //   description: "Használati útmutató",
  // })
  // async help(interaction: CommandInteraction) {
  //   logSlash(interaction);
  //   await interaction.reply("help");
  // }

  @Slash({
    name: "start",
    description: "Kezdj el egy értékelést",
  })
  async start(interaction: CommandInteraction) {
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
  }
}

export default Slashes;
