/* eslint-disable class-methods-use-this */
import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import {
  handleRatingStep,
  handleReaction,
  handleReset,
  handleSubmit,
} from "../logic/buttons";
import { getReportModal } from "../logic/modals";
import logger from "../utils/logger";

@Discord()
abstract class Buttons {
  @ButtonComponent({ id: /\d/ })
  async ratingStep(interaction: ButtonInteraction) {
    try {
      await handleRatingStep(interaction);
    } catch (error) {
      logger.error("ratingStep button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "submit" })
  async submit(interaction: ButtonInteraction) {
    try {
      await handleSubmit(interaction);
    } catch (error) {
      logger.error("submit button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "reset" })
  async reset(interaction: ButtonInteraction) {
    try {
      await handleReset(interaction);
    } catch (error) {
      logger.error("reset button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "up" })
  async up(interaction: ButtonInteraction) {
    try {
      await handleReaction(interaction);
    } catch (error) {
      logger.error("up button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "down" })
  async down(interaction: ButtonInteraction) {
    try {
      await handleReaction(interaction);
    } catch (error) {
      logger.error("down button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "report" })
  async report(interaction: ButtonInteraction) {
    try {
      const modal = getReportModal();
      await interaction.showModal(modal);
    } catch (error) {
      logger.error("report button interaction failed");
      logger.error(error);
    }
  }
}

export default Buttons;
