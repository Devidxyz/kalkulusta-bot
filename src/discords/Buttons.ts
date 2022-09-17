/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { getTeacherNamesReply } from "../core";
import Main from "../Main";
import { alphabet, STATUS } from "../static";
import { getRatingStatus } from "../utils/utils";

@Discord()
abstract class Buttons {
  @ButtonComponent(/\d/)
  async button(interaction: ButtonInteraction) {
    let pendingRating = Main.pendingRatings.get(interaction.user.id);
    const status = await getRatingStatus(pendingRating);

    switch (status) {
      case STATUS.EMPTY:
        const letter = alphabet[+interaction.customId];
        const payload = await getTeacherNamesReply(letter);
        await interaction.reply(payload);
        pendingRating = { character: letter };
        break;

      default:
        await interaction.reply(interaction.customId);
        break;
    }

    Main.pendingRatings.set(interaction.user.id, pendingRating);
    console.log(pendingRating);
  }
}

export default Buttons;
