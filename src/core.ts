import { InteractionReplyOptions, MessageEmbed } from "discord.js";
import Main from "./Main";
import { alphabetEmojis } from "./static";
import { channelToName, createButtonRows } from "./utils/utils";

const getCharactersReply = (): InteractionReplyOptions => {
  const rows = createButtonRows(null, alphabetEmojis);

  const embed = new MessageEmbed({
    title: "Válaszd ki az értékelendő oktató nevének a kezdőbetűjét!",
  });

  return { embeds: [embed], components: rows, ephemeral: true };
};

const getTeacherNamesReply = async (
  letter: string
): Promise<InteractionReplyOptions> => {
  const channels = await Main.guild.channels.fetch();
  const teachers = channels
    .filter((c) => c.parent && c.parent.name.toLowerCase() === letter)
    .map((c) => channelToName(c.name));

  const embed = new MessageEmbed({
    title: `${letter} betűvel kezdődő nevű oktatók`,
  });
  const rows = createButtonRows(teachers, null);

  return {
    embeds: [embed],
    components: rows,
    ephemeral: true,
  };
};

export { getCharactersReply, getTeacherNamesReply };
