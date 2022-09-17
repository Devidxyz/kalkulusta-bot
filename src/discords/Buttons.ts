/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { getTeacherNamesReply } from "../core";
import Main from "../Main";
import { alphabet, STATUS } from "../static";
import { channelToName, getTeacherChannels } from "../utils/utils";

@Discord()
abstract class Buttons {
  @ButtonComponent({ id: /\d-\d/ })
  async button(interaction: ButtonInteraction) {
    const data = interaction.customId.split("-");
    const step: STATUS = +data[0];
    const choice: number = +data[1];

    let pendingRating = Main.pendingRatings.get(interaction.user.id);
    // const status = await getRatingStatus(pendingRating);

    switch (step) {
      case STATUS.CHARACTER:
        const letter = alphabet[choice];
        const payload = await getTeacherNamesReply(letter);
        await interaction.reply(payload);
        pendingRating = { character: letter };
        break;
      case STATUS.TEACHER:
        console.log(pendingRating.character);
        const teacherChannels = await getTeacherChannels(
          pendingRating.character
        );
        console.log(teacherChannels.size);
        const teacherName = channelToName(
          [...teacherChannels.values()][choice].name
        );
        const embed = new EmbedBuilder({
          title: `${teacherName}`,
          description: "Add meg a tárgy(ak) nevét, amely(ek)ből oktatott.",
        });
        await interaction.reply({ embeds: [embed], ephemeral: true });
        break;

      default:
        await interaction.reply(`${step} ${choice}`);
        break;
    }

    Main.pendingRatings.set(interaction.user.id, pendingRating);
    console.log(pendingRating);
  }
}

export default Buttons;
