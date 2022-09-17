/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
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
        const teacherChannels = await getTeacherChannels(
          pendingRating.character
        );
        const teacherName = channelToName(
          [...teacherChannels.values()][choice].name
        );

        const modal = new ModalBuilder({
          customId: "subject-rating",
          title: `${teacherName} értékelése`,
          components: [
            new ActionRowBuilder<TextInputBuilder>({
              components: [
                new TextInputBuilder({
                  customId: "subject",
                  label: "Tárgy(ak) nevét, amely(ek)ből oktatott",
                  style: TextInputStyle.Short,
                  placeholder: "Kalkulus I.",
                  required: true,
                  maxLength: 100,
                }),
              ],
            }),
            new ActionRowBuilder<TextInputBuilder>({
              components: [
                new TextInputBuilder({
                  customId: "text",
                  label: "Írj egy szöveges értékelést",
                  style: TextInputStyle.Paragraph,
                  placeholder:
                    "Hogy jellemeznéd az oktató munkáját pár mondatban?",
                  maxLength: 1024,
                }),
              ],
            }),
          ],
        });
        interaction.showModal(modal);

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
