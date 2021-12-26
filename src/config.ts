import * as dotenv from "dotenv";

dotenv.config();

const discordToken = process.env.DISCORD_TOKEN;

const port = process.env.PORT || 8993;

if (!discordToken)
  throw new Error(
    "You need to specify the bot's DISCORD_TOKEN in the .env file."
  );

export default {
  discordToken,
  port,
};
