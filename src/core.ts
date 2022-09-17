import { EmbedBuilder, InteractionReplyOptions } from "discord.js";
import { alphabetEmojis, STATUS } from "./static";
import {
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
    title: `${letter} betűvel kezdődő nevű oktatók`,
  });
  const rows = createButtonRows(STATUS.TEACHER, teachers, null);

  return {
    embeds: [embed],
    components: rows,
    ephemeral: true,
  };
};

const getAskSubjectReply = async () => {};

export { getCharactersReply, getTeacherNamesReply };
