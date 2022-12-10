import {
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  EmbedBuilder,
  ButtonInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import Main from "../Main";
import { aspects, colors, footer, serverEmojis } from "../static";
import { PendingRating } from "../types";
import logger from "./logger";

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

const logButtonClick = (interaction: ButtonInteraction) => {
  logger.verbose(
    `${interaction.user.username}#${interaction.user.discriminator} clicked ${interaction.customId}`
  );
};

const logModalSubmit = (interaction: ModalSubmitInteraction) => {
  logger.verbose(
    `${interaction.user.username}#${
      interaction.user.discriminator
    } submitted ${JSON.stringify(interaction.fields.fields)}`
  );
};

const createButtonRows = (
  labels: string[],
  emojis: string[]
): ActionRowBuilder<MessageActionRowComponentBuilder>[] => {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  let buttons: ButtonBuilder[] = [];

  for (let i = 0; i < (labels?.length || emojis?.length); i += 1) {
    const button = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      customId: i.toString(),
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
    description: pendingRating.text,
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
    color: colors.rating,
    footer: { text: footer },
  });
  return embed;
};

const getReactionRows = (up: number = 0, down: number = 0) => {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [
    new ActionRowBuilder({
      components: [
        new ButtonBuilder({
          style: ButtonStyle.Secondary,
          customId: "up",
          emoji: serverEmojis.up,
        }),
        new ButtonBuilder({
          style: ButtonStyle.Secondary,
          customId: "up-counter",
          label: up.toString(),
          disabled: true,
        }),
        new ButtonBuilder({
          style: ButtonStyle.Secondary,
          customId: "down",
          emoji: serverEmojis.down,
        }),
        new ButtonBuilder({
          style: ButtonStyle.Secondary,
          customId: "down-counter",
          label: down.toString(),
          disabled: true,
        }),
        new ButtonBuilder({
          style: ButtonStyle.Danger,
          customId: "report",
          emoji: serverEmojis.report,
        }),
      ],
    }),
  ];
  return rows;
};

export {
  logSlash,
  logButtonClick,
  logModalSubmit,
  createButtonRows,
  channelToName,
  getTeacherChannels,
  buildRatingEmbed,
  getReactionRows,
};
