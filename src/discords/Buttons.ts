/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { getRatingStatus } from "../core";
import Main from "../Main";
import { alphabet, STATUS } from "../static";
import { channelToName, createButtonRows } from "../utils/utils";

@Discord()
abstract class Buttons {
  @ButtonComponent(/\d/)
  async button(interaction: ButtonInteraction) {
    const status = await getRatingStatus(interaction.user.id);
    switch (status) {
      case STATUS.EMPTY:
        const letter = alphabet[+interaction.customId];
        const channels = await Main.guild.channels.fetch();
        const teachers = channels
          .filter((c) => c.parent && c.parent.name.toLowerCase() === letter)
          .map((c) => channelToName(c.name));

        const rows = createButtonRows(teachers, null);
        await interaction.reply({ content: "asd", components: rows });

        break;

      default:
        await interaction.reply(interaction.customId);
        break;
    }
  }
}

export default Buttons;
