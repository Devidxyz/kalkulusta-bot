/* eslint-disable class-methods-use-this */
import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { getRatingStatus } from "../core";
import Main from "../Main";
import { logSlash } from "../utils/utils";

@Discord()
abstract class Slashes {
  @Slash("ping", {
    description: "Get the latency of the bot and the discord API.",
  })
  async ping(
    @SlashOption("asd", { required: false })
    asd: string,
    @SlashOption("qwe", { required: false })
    qwe: number,
    interaction: CommandInteraction
  ) {
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

    const status = await getRatingStatus(interaction.user.id);
    console.log(status);

    await interaction.reply("start");
  }
}

export default Slashes;
