import {
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  EmbedBuilder,
} from "discord.js";
import Main from "../Main";
import { aspects, footer, serverEmojis, STATUS } from "../static";
import { PendingRating } from "../types";
import logger from "./logger";

const getRatingStatus = async (
  pendingRating: PendingRating
): Promise<STATUS> => {
  if (!pendingRating || !pendingRating.character) {
    return STATUS.EMPTY;
  }

  if (pendingRating.character && !pendingRating.channelId) {
    return STATUS.CHARACTER;
  }

  if (pendingRating.channelId && !pendingRating.subject) {
    return STATUS.TEACHER;
  }

  if (pendingRating.subject && !pendingRating.text) {
    return STATUS.SUBJECT;
  }

  if (pendingRating.text && !pendingRating.aspects[0]) {
    return STATUS.TEXT;
  }

  if (pendingRating.aspects[0] && !pendingRating.aspects[1]) {
    return STATUS.ASPECT0;
  }

  if (pendingRating.aspects[1] && !pendingRating.aspects[2]) {
    return STATUS.ASPECT1;
  }

  if (pendingRating.aspects[2] && !pendingRating.aspects[3]) {
    return STATUS.ASPECT2;
  }

  if (pendingRating.aspects[3] && !pendingRating.aspects[4]) {
    return STATUS.ASPECT3;
  }

  if (pendingRating.aspects[4] && !pendingRating.sexy) {
    return STATUS.ASPECT4;
  }

  throw new Error("Unkown status");
};

const logSlash = (interaction: CommandInteraction) => {
  logger.verbose(
    `${interaction.user.username}#${interaction.user.discriminator} used /${
      interaction.commandName
    } ${
      interaction.options.data.length > 0
        ? `(${interaction.options.data
            .map((d) => (d.value ? `${d.name}: ${d.value}` : null))
            .join(", ")})`
        : ""
    }`
  );
};

const createButtonRows = (
  status: STATUS,
  labels: string[],
  emojis: string[]
): ActionRowBuilder<MessageActionRowComponentBuilder>[] => {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  let buttons: ButtonBuilder[] = [];

  for (let i = 0; i < (labels?.length || emojis?.length); i += 1) {
    const button = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      customId: `${status}-${i.toString()}`,
      label: labels?.[i],
      emoji: emojis?.[i],
    });
    buttons.push(button);
    if (i % 5 === 4) {
      rows.push(
        new ActionRowBuilder({
          components: buttons,
        })
      );
      buttons = [];
    }
  }
  if (buttons.length > 0) {
    rows.push(
      new ActionRowBuilder({
        components: buttons,
      })
    );
  }

  return rows;
};

const channelToName = (channelName: string) =>
  channelName
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
    .replace(/Dr$/, "Dr.");

const getTeacherChannels = async (letter: string) =>
  (await Main.guild.channels.fetch()).filter(
    (c) => c.parent?.name.toLowerCase() === letter
  );

const buildRatingEmbed = (pendingRating: PendingRating) => {
  const embed = new EmbedBuilder({
    title: `Tárgy: ${
      pendingRating.subject.charAt(0)?.toUpperCase() +
      pendingRating.subject.slice(1)
    }`,
    description: pendingRating.subject,
    fields: [
      ...[...Array(5).keys()].map((i) => ({
        name: aspects[i],
        value: pendingRating.aspects[i].toString(),
        inline: true,
      })),
      {
        name: "Sexy",
        value: pendingRating.sexy ? serverEmojis.sexy : "-",
        inline: true,
      },
    ],
    footer: { text: footer },
  });
  return embed;
};

export {
  logSlash,
  createButtonRows,
  channelToName,
  getRatingStatus,
  getTeacherChannels,
  buildRatingEmbed,
};
