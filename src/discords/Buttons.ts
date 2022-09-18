/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { ButtonInteraction, EmbedBuilder, TextBasedChannel } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import {
  getAskAspectReply,
  getAskSexyReply,
  getAskSubmitPayload,
  getRatingModal,
  getRestartRatingPayload,
  getTeacherNamesReply,
} from "../core";
import Main from "../Main";
import { alphabet, footer, serverEmojis, STATUS } from "../static";
import {
  buildRatingEmbed,
  channelToName,
  getTeacherChannels,
} from "../utils/utils";

@Discord()
abstract class Buttons {
  @ButtonComponent({ id: /\d-\d/ })
  async ratingStep(interaction: ButtonInteraction) {
    const data = interaction.customId.split("-");
    const step: STATUS = +data[0];
    const choice: number = +data[1];

    let pendingRating = Main.pendingRatings.get(interaction.user.id);
    if (
      !pendingRating &&
      step !== STATUS.CHARACTER &&
      step !== STATUS.TEACHER
    ) {
      await interaction.reply(getRestartRatingPayload());
      return;
    }

    switch (step) {
      case STATUS.CHARACTER:
        const letter = alphabet[choice];
        const teacherNamePayload = await getTeacherNamesReply(letter);
        await interaction.reply(teacherNamePayload);
        pendingRating = { character: letter };
        break;
      case STATUS.TEACHER:
        const teacherChannels = await getTeacherChannels(
          interaction.component.label?.[0]?.toLowerCase()
        );
        const teacherChannel = [...teacherChannels.values()][choice];
        const teacherName = channelToName(teacherChannel.name);
        const ratingModal = await getRatingModal(teacherName);
        pendingRating = { channelId: teacherChannel.id };
        interaction.showModal(ratingModal);
        break;
      case STATUS.ASPECT0:
        pendingRating.aspects = [choice + 1];
        const askAspect1Payload = await getAskAspectReply(1);
        await interaction.reply(askAspect1Payload);
        break;
      case STATUS.ASPECT1:
        pendingRating.aspects[1] = choice + 1;
        const askAspect2Payload = await getAskAspectReply(2);
        await interaction.reply(askAspect2Payload);
        break;
      case STATUS.ASPECT2:
        pendingRating.aspects[2] = choice + 1;
        const askAspect3Payload = await getAskAspectReply(3);
        await interaction.reply(askAspect3Payload);
        break;
      case STATUS.ASPECT3:
        pendingRating.aspects[3] = choice + 1;
        const askAspect4Payload = await getAskAspectReply(4);
        await interaction.reply(askAspect4Payload);
        break;
      case STATUS.ASPECT4:
        pendingRating.aspects[4] = choice + 1;
        const askSexyPayload = getAskSexyReply();
        await interaction.reply(askSexyPayload);
        break;
      case STATUS.SEXY:
        pendingRating.sexy = choice === 0;
        const askSubmitPayload = getAskSubmitPayload(pendingRating);
        await interaction.reply(askSubmitPayload);
        break;
      default:
        await interaction.reply(`${step} ${choice}`);
        break;
    }

    Main.pendingRatings.set(interaction.user.id, pendingRating);
  }

  @ButtonComponent({ id: "submit" })
  async submit(interaction: ButtonInteraction) {
    const pendingRating = Main.pendingRatings.get(interaction.user.id);
    if (
      pendingRating &&
      pendingRating.channelId &&
      pendingRating.subject &&
      pendingRating.text &&
      pendingRating.sexy !== undefined &&
      pendingRating.aspects.every((x) => x)
    ) {
      const ratingEmbed = buildRatingEmbed(pendingRating);
      const channel: TextBasedChannel = (await Main.guild.channels.fetch(
        pendingRating.channelId
      )) as TextBasedChannel;
      const ratingMessage = await channel.send({ embeds: [ratingEmbed] });
      await ratingMessage.react("👍");
      await ratingMessage.react("👎");
      await ratingMessage.react(serverEmojis.report);

      const embed = new EmbedBuilder({
        title: "Köszönjük, hogy a Kalkulusták MMP-t választottad.",
        description: "Értékelj más oktatókat is!",
        fields: [
          { name: "Ugrás az értékelésedhez", value: ratingMessage.url },
          {
            name: "A bot source code-ja",
            value: "https://github.com/Devidxyz/kalkulusta-bot-ts",
          },
          {
            name: "Ha a bot működésében hibát tapasztalsz, vagy egyéb probléma esetén keresd őt:",
            value: `<@398115483590852620>`,
          },
        ],
        footer: { text: footer },
      });
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply(getRestartRatingPayload());
    }
  }

  @ButtonComponent({ id: "reset" })
  async reset(interaction: ButtonInteraction) {
    Main.pendingRatings.delete(interaction.user.id);
    const embed = new EmbedBuilder({
      title: "Folyamat megszakítva",
      description:
        "Egy új értékelés megkezdéséhez a `/start` parancsot tudod használni.",
    });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export default Buttons;
