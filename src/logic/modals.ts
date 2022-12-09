import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

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

export { getRatingModal, getReportModal };
