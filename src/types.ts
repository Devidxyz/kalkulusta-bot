import { ButtonInteraction } from "discord.js";
import { STATUS } from "./static";

type PendingRating = {
  status: STATUS;
  interaction?: ButtonInteraction;
  character?: string;
  channelId?: string;
  subject?: string;
  text?: string;
  aspects?: number[];
  sexy?: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export { PendingRating };
