/* eslint-disable class-methods-use-this */
import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import { getAskAspectReply, getCharactersReply } from "../logic/replies";
import Main from "../Main";
import { colors, footer } from "../static";

@Discord()
class Modals {
  @ModalComponent({ id: "subject-rating" })
  async subjectRating(interaction: ModalSubmitInteraction) {
    const pendingRating = Main.pendingRatings.get(interaction.user.id);
    if (!pendingRating) {
      await interaction.reply(getCharactersReply());
      return;
    }

    pendingRating.subject = interaction.fields.getTextInputValue("subject");
    pendingRating.text = interaction.fields.getTextInputValue("text");
    pendingRating.status += 1;

    Main.pendingRatings.set(interaction.user.id, pendingRating);

    const payload = getAskAspectReply(0);
    await interaction.deferUpdate();
    await pendingRating.interaction.editReply(payload);
  }

  @ModalComponent({ id: "report-submit" })
  async report(interaction: ModalSubmitInteraction) {
    const embed = new EmbedBuilder({
      title: `${interaction.user.username}#${interaction.user.discriminator} reported a message in #${interaction.channel.name}`,
      fields: [
        { name: "Author", value: `<@${interaction.user.id}>`, inline: true },
        {
          name: "Channel",
          value: `<#${interaction.channel.id}>`,
          inline: true,
        },
        {
          name: "Reason",
          value: interaction.fields.getTextInputValue("reason"),
          inline: false,
        },
        {
          name: "Link",
          value: interaction.message.url,
          inline: false,
        },
      ],
      color: colors.warning,
      footer: { text: footer },
    });
    Main.logChannel.send({ embeds: [embed] });
    await interaction.deferUpdate();
  }
}

export default Modals;
