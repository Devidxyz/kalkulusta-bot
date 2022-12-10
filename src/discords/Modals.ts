/* eslint-disable class-methods-use-this */
import { ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import { handleReportSubmit, handleSubjectRatingSubmit } from "../logic/modals";
import logger from "../utils/logger";
import { logModalSubmit } from "../utils/utils";

@Discord()
class Modals {
  @ModalComponent({ id: "subject-rating" })
  async subjectRating(interaction: ModalSubmitInteraction) {
    try {
      logModalSubmit(interaction);
      await handleSubjectRatingSubmit(interaction);
    } catch (error) {
      logger.error("subjectRating modal interaction failed");
      logger.error(error);
    }
  }

  @ModalComponent({ id: "report-submit" })
  async report(interaction: ModalSubmitInteraction) {
    try {
      logModalSubmit(interaction);
      await handleReportSubmit(interaction);
    } catch (error) {
      logger.error("report modal interaction failed");
      logger.error(error);
    }
  }
}

export default Modals;
