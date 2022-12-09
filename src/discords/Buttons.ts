/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import { ButtonInteraction, EmbedBuilder, TextBasedChannel } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { handleReaction } from "../logic/buttons";
import { getRatingModal, getReportModal } from "../logic/modals";
import {
  getAskAspectReply,
  getAskSexyReply,
  getAskSubmitReply,
  getCharactersReply,
  getTeacherNamesReply,
} from "../logic/replies";
import prisma from "../database";
import Main from "../Main";
import { alphabet, colors, footer, STATUS } from "../static";
import { PendingRating } from "../types";
import logger from "../utils/logger";
import {
  buildRatingEmbed,
  channelToName,
  getReactionRows,
  getTeacherChannels,
} from "../utils/utils";

@Discord()
abstract class Buttons {
  @ButtonComponent({ id: /\d/ })
  async ratingStep(interaction: ButtonInteraction) {
    const choice: number = +interaction.customId;

    let pendingRating: PendingRating = Main.pendingRatings.get(
      interaction.user.id
    ) || { status: STATUS.CHARACTER };

    switch (pendingRating.status) {
      case STATUS.CHARACTER:
        const letter = alphabet[choice];
        const teacherNamePayload = await getTeacherNamesReply(letter);
        await interaction.update(teacherNamePayload);
        pendingRating = {
          character: letter,
          status: STATUS.TEACHER,
          aspects: [],
          interaction,
        };
        break;
      case STATUS.TEACHER:
        const teacherChannels = await getTeacherChannels(
          interaction.component.label?.[0]?.toLowerCase()
        );
        const teacherChannel = [...teacherChannels.values()][choice];
        // TODO: check if already submitted rating
        const teacherName = channelToName(teacherChannel.name);
        const ratingModal = getRatingModal(teacherName);
        pendingRating = {
          ...pendingRating,
          channelId: teacherChannel.id,
          interaction,
          status: pendingRating.status + 1,
        };
        await interaction.showModal(ratingModal);
        break;
      case STATUS.ASPECT0:
      case STATUS.ASPECT1:
      case STATUS.ASPECT2:
      case STATUS.ASPECT3:
        pendingRating.aspects.push(choice + 1);
        pendingRating.status += 1;
        const askAspectPayload = getAskAspectReply(
          pendingRating.status - STATUS.ASPECT0
        );
        await interaction.update(askAspectPayload);
        break;
      case STATUS.ASPECT4:
        pendingRating.aspects[4] = choice + 1;
        pendingRating.status += 1;
        const askSexyPayload = getAskSexyReply();
        await interaction.update(askSexyPayload);
        break;
      case STATUS.SEXY:
        pendingRating.sexy = choice === 0;
        pendingRating.status += 1;
        const askSubmitPayload = getAskSubmitReply(pendingRating);
        await interaction.update(askSubmitPayload);
        break;
      default:
        logger.error(
          `ratingStep default case reached, pendingRating=${JSON.stringify(
            pendingRating
          )} ${interaction.customId}`
        );
        await interaction.update(getCharactersReply());
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
      const rows = getReactionRows();
      const ratingMessage = await channel.send({
        embeds: [ratingEmbed],
        components: rows,
      });

      await prisma.rating.create({
        data: {
          userId: interaction.user.id,
          channelId: interaction.channelId,
          msgId: ratingMessage.id,
          subject: pendingRating.subject,
          text: pendingRating.text,
          aspect1: pendingRating.aspects[0],
          aspect2: pendingRating.aspects[1],
          aspect3: pendingRating.aspects[2],
          aspect4: pendingRating.aspects[3],
          aspect5: pendingRating.aspects[4],
          sexy: pendingRating.sexy,
        },
      });

      Main.pendingRatings.delete(interaction.user.id);

      const embed = new EmbedBuilder({
        title: "Köszönjük, hogy a Kalkulusták MMP-t választottad.",
        description: "Értékelj más oktatókat is!",
        fields: [
          { name: "Ugrás az értékelésedhez", value: ratingMessage.url },
          {
            name: "A bot source code-ja",
            value: "https://github.com/Devidxyz/kalkulusta-bot",
          },
          {
            name: "Ha a bot működésében hibát tapasztalsz / egyéb probléma esetén keresd őt:",
            value: `<@398115483590852620>`,
          },
        ],
        color: colors.success,
        footer: { text: footer },
      });
      await interaction.update({
        content: null,
        embeds: [embed],
        components: [],
      });
    } else {
      await interaction.update(getCharactersReply());
    }
  }

  @ButtonComponent({ id: "reset" })
  async reset(interaction: ButtonInteraction) {
    Main.pendingRatings.delete(interaction.user.id);
    const embed = new EmbedBuilder({
      title: "Folyamat megszakítva",
      description:
        "Egy új értékelés megkezdéséhez a `/start` parancsot tudod használni.",
      color: colors.warning,
      footer: { text: footer },
    });
    await interaction.update({
      content: null,
      embeds: [embed],
      components: [],
    });
  }

  @ButtonComponent({ id: "up" })
  async up(interaction: ButtonInteraction) {
    handleReaction(interaction);
  }

  @ButtonComponent({ id: "down" })
  async down(interaction: ButtonInteraction) {
    handleReaction(interaction);
  }

  @ButtonComponent({ id: "report" })
  async report(interaction: ButtonInteraction) {
    const modal = getReportModal();
    await interaction.showModal(modal);
  }
}

export default Buttons;
