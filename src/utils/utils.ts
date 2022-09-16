import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
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

const createButtonRows = (labels: string[], emojis: string[]) => {
  const rows: MessageActionRow[] = [];
  let buttons: MessageButton[] = [];

  for (let i = 0; i < (labels?.length || emojis.length); i += 1) {
    const button = new MessageButton({
      style: "SECONDARY",
      customId: i.toString(),
      label: labels?.[i],
      emoji: emojis?.[i],
    });
    buttons.push(button);
    if (i % 5 === 4) {
      rows.push(new MessageActionRow({ components: buttons }));
      buttons = [];
    }
  }
  if (buttons.length > 0) {
    rows.push(new MessageActionRow({ components: buttons }));
  }

  return rows;
};

const channelToName = (channelName: string) =>
  channelName
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
    .replace(/Dr$/, "Dr.");

export { logSlash, createButtonRows, channelToName };
