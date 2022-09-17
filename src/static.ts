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

// eslint-disable-next-line no-shadow
enum STATUS {
  EMPTY,
  CHARACTER,
  TEACHER,
  SUBJECT,
  TEXT,
  ASPECT1,
  ASPECT2,
  ASPECT3,
  ASPECT4,
  ASPECT5,
  UNKONWN,
}

export { alphabet, alphabetEmojis, STATUS };
