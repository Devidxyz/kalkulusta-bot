/* eslint-disable class-methods-use-this */
import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import {
  handlePageChange,
  handleRatingStep,
  handleReaction,
  handleReset,
  handleSubmit,
} from "../logic/buttons";
import { getReportModal } from "../logic/modals";
import logger from "../utils/logger";
import { logButtonClick } from "../utils/utils";

@Discord()
abstract class Buttons {
  @ButtonComponent({ id: /\d/ })
  async ratingStep(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      await handleRatingStep(interaction);
    } catch (error) {
      logger.error("ratingStep button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "submit" })
  async submit(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      await handleSubmit(interaction);
    } catch (error) {
      logger.error("submit button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "reset" })
  async reset(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      await handleReset(interaction);
    } catch (error) {
      logger.error("reset button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "up" })
  async up(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      await handleReaction(interaction);
    } catch (error) {
      logger.error("up button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "down" })
  async down(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      await handleReaction(interaction);
    } catch (error) {
      logger.error("down button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "report" })
  async report(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      const modal = getReportModal();
      await interaction.showModal(modal);
    } catch (error) {
      logger.error("report button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "next-page" })
  async nextPage(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      await handlePageChange(interaction, true);
    } catch (error) {
      logger.error("nextPage button interaction failed");
      logger.error(error);
    }
  }

  @ButtonComponent({ id: "previous-page" })
  async previousPage(interaction: ButtonInteraction) {
    try {
      logButtonClick(interaction);
      await handlePageChange(interaction, false);
    } catch (error) {
      logger.error("previousPage button interaction failed");
      logger.error(error);
    }
  }
}

export default Buttons;
