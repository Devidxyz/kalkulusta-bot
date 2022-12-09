import * as dotenv from "dotenv";

dotenv.config();

const discordToken = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD;
const reportEmoji = process.env.REPORT_EMOJI;
const sexyEmoji = process.env.SEXY_EMOJI;
const upEmoji = process.env.UP_EMOJI;
const downEmoji = process.env.DOWN_EMOJI;
const logChannal = process.env.LOG_CHANNEL;

const port = process.env.PORT || 8993;

if (!discordToken)
  throw new Error(
    "You need to specify the bot's DISCORD_TOKEN in the .env file."
  );

if (!guildId)
  throw new Error("You need to specify the GUILD in the .env file.");

export default {
  discordToken,
  guildId,
  port,
  logChannal,
  emojis: {
    report: reportEmoji,
    sexy: sexyEmoji,
    up: upEmoji,
    down: downEmoji,
  },
};
