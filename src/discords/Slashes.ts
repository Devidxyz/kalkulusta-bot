/* eslint-disable class-methods-use-this */
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { getCharactersReply } from "../core";
import Main from "../Main";
import { STATUS } from "../static";
import { getRatingStatus, logSlash } from "../utils/utils";

@Discord()
abstract class Slashes {
  @Slash("ping", {
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

  @Slash("help", {
    description: "Használati útmutató",
  })
  async help(interaction: CommandInteraction) {
    logSlash(interaction);
    await interaction.reply("help");
  }

  @Slash("start", {
    description: "Kezdj el egy értékelést",
  })
  async start(interaction: CommandInteraction) {
    logSlash(interaction);

    const pendingRating = Main.pendingRatings.get(interaction.user.id);
    const status = await getRatingStatus(pendingRating);
    console.log(status);

    switch (status) {
      case STATUS.EMPTY:
        await interaction.reply(getCharactersReply());
        break;

      default:
        await interaction.reply("lol");
        break;
    }
  }
}

export default Slashes;
