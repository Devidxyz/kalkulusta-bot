import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionUpdateOptions,
  MessageActionRowComponentBuilder,
} from "discord.js";
import {
  alphabetEmojis,
  aspects,
  colors,
  interactionEmojis,
  numberEmojis,
} from "../static";
import { PendingRating } from "../types";
import {
  buildRatingEmbed,
  channelToName,
  createButtonRows,
  getTeacherChannels,
} from "../utils/utils";

const getCharactersReply = () => {
  const rows = createButtonRows(null, alphabetEmojis);

  const embed = new EmbedBuilder({
    title: "Válaszd ki az értékelendő oktató nevének a kezdőbetűjét!",
    color: colors.default,
  });

  return { embeds: [embed], components: rows, ephemeral: true };
};

const getTeacherNamesReply = async (
  letter: string
): Promise<InteractionUpdateOptions> => {
  const teacherChannels = await getTeacherChannels(letter);
  const teachers = teacherChannels.map((c) => channelToName(c.name));

  const embed = new EmbedBuilder({
    title: `"${letter.toUpperCase()}" betűvel kezdődő nevű oktatók`,
    color: colors.default,
  });
  const rows = createButtonRows(teachers, null);

  return {
    embeds: [embed],
    components: rows,
  };
};

const getAskAspectReply = (num: number): InteractionUpdateOptions => {
  const embed = new EmbedBuilder({
    title: aspects[num],
    description: "Kattints a megfelelő gombra.",
    color: colors.default,
  });
  const rows = createButtonRows(null, numberEmojis);
  return {
    embeds: [embed],
    components: rows,
  };
};

const getAskSexyReply = (): InteractionUpdateOptions => {
  const embed = new EmbedBuilder({
    title: "Jól néz ki?",
    description: "Kattints a megfelelő gombra.",
    color: colors.default,
  });
  const rows = createButtonRows(null, [
    interactionEmojis.tick,
    interactionEmojis.x,
  ]);
  return {
    embeds: [embed],
    components: rows,
  };
};

const getAskSubmitReply = (
  pendingRating: PendingRating
): InteractionUpdateOptions => {
  const ratingEmbed = buildRatingEmbed(pendingRating);
  const askSendEmbed = new EmbedBuilder({
    title: "Beküldöd?",
    color: colors.default,
  });

  const submitButton = new ButtonBuilder({
    emoji: interactionEmojis.tick,
    customId: "submit",
    style: ButtonStyle.Success,
  });
  const resetButton = new ButtonBuilder({
    emoji: interactionEmojis.x,
    customId: "reset",
    style: ButtonStyle.Secondary,
  });

  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>({
    components: [submitButton, resetButton],
  });

  return {
    content: "Így fog kinézni az értékelésed:",
    embeds: [ratingEmbed, askSendEmbed],
    components: [row],
  };
};

export {
  getCharactersReply,
  getTeacherNamesReply,
  getAskAspectReply,
  getAskSubmitReply,
  getAskSexyReply,
};
