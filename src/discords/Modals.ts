/* eslint-disable class-methods-use-this */
import { ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import { getAskAspectReply, getRestartRatingPayload } from "../core";
import Main from "../Main";

@Discord()
class Modals {
  @ModalComponent({ id: "subject-rating" })
  async subjectRating(interaction: ModalSubmitInteraction) {
    const pendingRating = Main.pendingRatings.get(interaction.user.id);
    if (!pendingRating) {
      await interaction.reply(getRestartRatingPayload());
      return;
    }

    pendingRating.subject = interaction.fields.getTextInputValue("subject");
    pendingRating.text = interaction.fields.getTextInputValue("text");

    Main.pendingRatings.set(interaction.user.id, pendingRating);

    const payload = await getAskAspectReply(0);
    await interaction.reply(payload);
  }
}

export default Modals;
