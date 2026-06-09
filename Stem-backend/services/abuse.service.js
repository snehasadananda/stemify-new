const BAD_WORDS = [
  "suicide",
  "kill",
  "porn",
  "drug",
  "hate"
];

export const checkAbuse = (text) => {

  for (let w of BAD_WORDS) {
    if (text.toLowerCase().includes(w)) {
      return {
        flagged: true,
        reason: `Contains restricted word: ${w}`
      };
    }
  }

  return { flagged: false };
};
