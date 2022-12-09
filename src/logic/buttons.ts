import { ButtonInteraction } from "discord.js";
import prisma from "../database";
import { getReactionRows } from "../utils/utils";

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

// eslint-disable-next-line import/prefer-default-export
export { handleReaction };
