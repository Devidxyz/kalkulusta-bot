/* eslint-disable no-case-declarations */
import { ButtonInteraction, EmbedBuilder, TextBasedChannel } from "discord.js";
import prisma from "../database";
import Main from "../Main";
import { STATUS, alphabet, colors, footer } from "../static";
import { PendingRating } from "../types";
import logger from "../utils/logger";
import {
  buildRatingEmbed,
  channelToName,
  getReactionRows,
  getTeacherChannels,
} from "../utils/utils";
import { getRatingModal } from "./modals";
import {
  getTeacherNamesReply,
  getAskAspectReply,
  getAskSexyReply,
  getAskSubmitReply,
  getCharactersReply,
} from "./replies";
import { refreshSummaryMessage } from "./summary";

const handleRatingStep = async (interaction: ButtonInteraction) => {
  const choice: number = +interaction.customId;

  let pendingRating: PendingRating = Main.pendingRatings.get(
    interaction.user.id
  ) || { status: STATUS.CHARACTER };

  switch (pendingRating.status) {
    case STATUS.CHARACTER:
      const letter = alphabet[choice];
      const teacherNamePayload = await getTeacherNamesReply(
        letter,
        pendingRating.page
      );
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
      const teacherChannel = [...teacherChannels.values()][
        choice + (pendingRating.page ? pendingRating.page * 25 : 0)
      ];

      const existingRating = await prisma.rating.findFirst({
        where: { channelId: teacherChannel.id, userId: interaction.user.id },
      });
      if (existingRating) {
        await interaction.update({
          content:
            "Őt már értékelted. Egy oktatót csak egyszer értékelhet egy ember.",
        });
        return;
      }

      const teacherName = channelToName(teacherChannel.name);
      const ratingModal = getRatingModal(teacherName);
      pendingRating = {
        ...pendingRating,
        channelId: teacherChannel.id,
        interaction,
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
      Main.pendingRatings.delete(interaction.user.id);
      await interaction.update(getCharactersReply());
      break;
  }

  Main.pendingRatings.set(interaction.user.id, pendingRating);
};

const handleSubmit = async (interaction: ButtonInteraction) => {
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
        channelId: channel.id,
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

    await refreshSummaryMessage(channel);
  } else {
    await interaction.update(getCharactersReply());
  }
};

const handleReset = async (interaction: ButtonInteraction) => {
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
};

const handleReaction = async (interaction: ButtonInteraction) => {
  const positive = interaction.customId === "up";

  const existingReaction = await prisma.reaction.findUnique({
    where: {
      userId_msgId: {
        userId: interaction.user.id,
        msgId: interaction.message.id,
      },
    },
  });

  const ratingOwner = await prisma.rating.findUnique({
    where: { msgId: interaction.message.id },
  });

  if (ratingOwner?.userId === interaction.user.id) {
    await interaction.deferUpdate();
    return;
  }

  const existingRow = interaction.message.components[0].components;
  let upCounter = +(existingRow[1] as any).label;
  let downCounter = +(existingRow[3] as any).label;

  let isDelete: boolean = false;
  if (existingReaction) {
    if (existingReaction.positive && positive) {
      upCounter -= 1;
      isDelete = true;
    } else if (existingReaction.positive && !positive) {
      upCounter -= 1;
      downCounter += 1;
    } else if (!existingReaction.positive && positive) {
      downCounter -= 1;
      upCounter += 1;
    } else if (!existingReaction.positive && !positive) {
      downCounter -= 1;
      isDelete = true;
    }
  } else if (positive) {
    upCounter += 1;
  } else {
    downCounter += 1;
  }

  const newRows = getReactionRows(upCounter, downCounter);

  await interaction.update({
    components: newRows,
  });

  if (!isDelete) {
    await prisma.reaction.upsert({
      where: {
        userId_msgId: {
          userId: interaction.user.id,
          msgId: interaction.message.id,
        },
      },
      update: {
        positive,
      },
      create: {
        userId: interaction.user.id,
        msgId: interaction.message.id,
        positive,
      },
    });
  } else {
    await prisma.reaction.delete({
      where: {
        userId_msgId: {
          userId: interaction.user.id,
          msgId: interaction.message.id,
        },
      },
    });
  }
};

const handlePageChange = async (
  interaction: ButtonInteraction,
  next: boolean
) => {
  const pendingRating: PendingRating = Main.pendingRatings.get(
    interaction.user.id
  );

  if (!pendingRating || !pendingRating.character) {
    await interaction.update(getCharactersReply());
  }

  pendingRating.page = next ? 1 : 0;
  const teacherNamePayload = await getTeacherNamesReply(
    pendingRating.character,
    pendingRating.page
  );
  await interaction.update(teacherNamePayload);

  Main.pendingRatings.set(interaction.user.id, pendingRating);
};

export {
  handleRatingStep,
  handleSubmit,
  handleReset,
  handleReaction,
  handlePageChange,
};
