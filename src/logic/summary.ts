import { EmbedBuilder, TextBasedChannel } from "discord.js";
import prisma from "../database";
import { colors, footer } from "../static";
import logger from "../utils/logger";

const buildSummaryMessageEmbed = (averages: {
  aspect1: number;
  aspect2: number;
  aspect3: number;
  aspect4: number;
  aspect5: number;
  total: number;
}) => {
  const embed = new EmbedBuilder({
    fields: [
      { name: "Összesített", value: averages.total.toString(), inline: true },
      {
        name: "Követelmények teljesíthetősége",
        value: averages.aspect1.toString(),
        inline: true,
      },
      {
        name: "Tárgy hasznossága",
        value: averages.aspect2.toString(),
        inline: true,
      },
      {
        name: "Segítőkészség",
        value: averages.aspect3.toString(),
        inline: true,
      },
      {
        name: "Felkészültség",
        value: averages.aspect4.toString(),
        inline: true,
      },
      { name: "Előadásmód", value: averages.aspect5.toString(), inline: true },
    ],
    color: colors.summaryMessage,
    footer: { text: footer },
  });
  return embed;
};

const refreshSummaryMessage = async (channel: TextBasedChannel) => {
  const ratingsOfTeacher = await prisma.rating.findMany({
    where: { channelId: channel.id },
  });

  if (ratingsOfTeacher.length === 0) {
    return;
  }

  const sums = {
    aspect1: 0,
    aspect2: 0,
    aspect3: 0,
    aspect4: 0,
    aspect5: 0,
    total: 0,
  };

  ratingsOfTeacher.forEach((x) => {
    sums.aspect1 += x.aspect1;
    sums.aspect2 += x.aspect2;
    sums.aspect3 += x.aspect3;
    sums.aspect4 += x.aspect4;
    sums.aspect5 += x.aspect5;
    sums.total += x.aspect1 + x.aspect2 + x.aspect3 + x.aspect4 + x.aspect5;
  });

  const averages = {
    aspect1: sums.aspect1 / ratingsOfTeacher.length,
    aspect2: sums.aspect2 / ratingsOfTeacher.length,
    aspect3: sums.aspect3 / ratingsOfTeacher.length,
    aspect4: sums.aspect4 / ratingsOfTeacher.length,
    aspect5: sums.aspect5 / ratingsOfTeacher.length,
    total: sums.total / (ratingsOfTeacher.length * 5),
  };

  const existingSummaryMessageFromDb = await prisma.summaryMessage.findUnique({
    where: { channelId: channel.id },
  });
  if (existingSummaryMessageFromDb) {
    try {
      const existingSummaryMessage = await channel.messages.fetch(
        existingSummaryMessageFromDb.msgId
      );
      await existingSummaryMessage.delete();
    } catch (error) {
      logger.error(`Cannot delet existing summary message in ${channel.id}`);
      logger.error(error);
    }
  }

  const embed = buildSummaryMessageEmbed(averages);
  const newSummaryMessage = await channel.send({ embeds: [embed] });

  await prisma.summaryMessage.upsert({
    where: { channelId: channel.id },
    create: { channelId: channel.id, msgId: newSummaryMessage.id },
    update: { msgId: newSummaryMessage.id },
  });
};

// eslint-disable-next-line import/prefer-default-export
export { refreshSummaryMessage };
