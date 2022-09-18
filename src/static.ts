import config from "./config";

/* eslint-disable no-unused-vars */
const alphabet = "abcdefghijklmnoprstuvwxyz";
const alphabetEmojis = [
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
  "🇯",
  "🇰",
  "🇱",
  "🇲",
  "🇳",
  "🇴",
  "🇵",
  "🇷",
  "🇸",
  "🇹",
  "🇺",
  "🇻",
  "🇼",
  "🇽",
  "🇾",
  "🇿",
];

const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

// eslint-disable-next-line no-shadow
enum STATUS {
  EMPTY,
  CHARACTER,
  TEACHER,
  SUBJECT,
  TEXT,
  ASPECT0,
  ASPECT1,
  ASPECT2,
  ASPECT3,
  ASPECT4,
  SEXY,
}

const aspects = [
  "Követelmények teljesíthetősége",
  "Tárgy hasznossága",
  "Segítőkészség",
  "Felkészültség",
  "Előadásmód",
  "Sexy",
];

const footer = `Kalkulusta-bot v2.0`;

const interactionEmojis = {
  tick: "✅",
  x: "❌",
};

const serverEmojis = {
  sexy: `<:sexy:${config.emojis.sexy}>`,
  report: `<:report:${config.emojis.report}>`,
};

export {
  alphabet,
  alphabetEmojis,
  numberEmojis,
  STATUS,
  aspects,
  footer,
  interactionEmojis,
  serverEmojis,
};
