// src/utils/scoreCalculator.js

/**
 * 'T20'や'DBULL'のような文字列からスコアを計算する関数
 * @param {string} area - ヒットしたエリアのID
 * @returns {number} 計算されたスコア
 */
export const calculateScore = (area) => {
  const prefix = area.charAt(0);
  const numberPart = area.slice(1);

  if (area === "BULL") return 25;
  if (area === "DBULL") return 50;
  if (area === "OUT") return 0;

  const number = parseInt(numberPart, 10);

  switch (prefix) {
    case 'T': // Triple
      return number * 3;
    case 'D': // Double
      return number * 2;
    case 'S': // Single
    default:
      return number;
  }
};