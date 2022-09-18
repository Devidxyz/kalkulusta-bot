import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {
  alphabetEmojis,
  aspects,
  interactionEmojis,
  numberEmojis,
  STATUS,
} from "./static";
import { PendingRating } from "./types";
import {
  buildRatingEmbed,
  channelToName,
  createButtonRows,
  getTeacherChannels,
} from "./utils/utils";

const getCharactersReply = (): InteractionReplyOptions => {
  const rows = createButtonRows(STATUS.CHARACTER, null, alphabetEmojis);

  const embed = new EmbedBuilder({
    title: "Válaszd ki az értékelendő oktató nevének a kezdőbetűjét!",
  });

  return { embeds: [embed], components: rows, ephemeral: true };
};

const getTeacherNamesReply = async (
  letter: string
): Promise<InteractionReplyOptions> => {
  const teacherChannels = await getTeacherChannels(letter);
  const teachers = teacherChannels.map((c) => channelToName(c.name));

  const embed = new EmbedBuilder({
    title: `"${letter.toUpperCase()}" betűvel kezdődő nevű oktatók`,
  });
  const rows = createButtonRows(STATUS.TEACHER, teachers, null);

  return {
    embeds: [embed],
    components: rows,
    ephemeral: true,
  };
};

const getRatingModal = async (teacherName: string) => {
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
            placeholder: "Hogy jellemeznéd az oktató munkáját pár mondatban?",
            maxLength: 1024,
          }),
        ],
      }),
    ],
  });
  return modal;
};

const getAskAspectReply = (num: number): InteractionReplyOptions => {
  const embed = new EmbedBuilder({
    title: aspects[num],
    description: "Kattints a megfelelő gombra.",
  });
  const rows = createButtonRows(STATUS[`ASPECT${num}`], null, numberEmojis);
  return {
    embeds: [embed],
    components: rows,
    ephemeral: true,
  };
};

const getAskSexyReply = (): InteractionReplyOptions => {
  const embed = new EmbedBuilder({
    title: "Jól néz ki?",
    description: "Kattints a megfelelő gombra.",
  });
  const rows = createButtonRows(STATUS.SEXY, null, [
    interactionEmojis.tick,
    interactionEmojis.x,
  ]);
  return {
    embeds: [embed],
    components: rows,
    ephemeral: true,
  };
};

const getRestartRatingPayload = () => {
  const newRatingEmbed = new EmbedBuilder({ title: "Új értékelés." });
  const charactersReply = getCharactersReply();
  charactersReply.embeds.unshift(newRatingEmbed);
  return charactersReply;
};

const getAskSubmitPayload = (
  pendingRating: PendingRating
): InteractionReplyOptions => {
  const ratingEmbed = buildRatingEmbed(pendingRating);
  const infoEmbed = new EmbedBuilder({
    title: "Így fog kinézni az értékelésed.",
  });
  const askSendEmbed = new EmbedBuilder({ title: "Beküldöd?" });

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
    embeds: [infoEmbed, ratingEmbed, askSendEmbed],
    components: [row],
    ephemeral: true,
  };
};

export {
  getCharactersReply,
  getTeacherNamesReply,
  getAskAspectReply,
  getRestartRatingPayload,
  getRatingModal,
  getAskSubmitPayload,
  getAskSexyReply,
};
