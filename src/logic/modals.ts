import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  EmbedBuilder,
} from "discord.js";
import Main from "../Main";
import { colors, footer } from "../static";
import { getCharactersReply, getAskAspectReply } from "./replies";

const getRatingModal = (teacherName: string) => {
  const modal = new ModalBuilder({
    customId: "subject-rating",
    title: `${teacherName} értékelése`,
    components: [
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: "subject",
            label: "Tárgy(ak) nevét, amely(ek)ből oktatott",
            style: TextInputStyle.Short,
            placeholder: "Kalkulus I.",
            required: true,
            maxLength: 100,
          }),
        ],
      }),
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: "text",
            label: "Írj egy szöveges értékelést",
            style: TextInputStyle.Paragraph,
            placeholder:
              "Hogy jellemeznéd az oktató munkáját? (Ha hosszú szöveget írsz érdemes kimásolni küldés előtt.)",
            maxLength: 1024,
          }),
        ],
      }),
    ],
  });
  return modal;
};

const getReportModal = () => {
  const modal = new ModalBuilder({
    customId: "report-submit",
    title: `Üzenet jelentése`,
    components: [
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: "reason",
            label: "Indoklás",
            style: TextInputStyle.Paragraph,
            placeholder:
              "Írd le, hogy szerinted miért nincs helye ennek az értékelésnek a szerveren, milyen szabályt sért.",
            maxLength: 1024,
          }),
        ],
      }),
    ],
  });
  return modal;
};

const handleSubjectRatingSubmit = async (
  interaction: ModalSubmitInteraction
) => {
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
};

const handleReportSubmit = async (interaction: ModalSubmitInteraction) => {
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
};

export {
  getRatingModal,
  getReportModal,
  handleSubjectRatingSubmit,
  handleReportSubmit,
};
