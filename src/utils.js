/**
 * @param {number} num
 */
export function round(num) {
  return Math.round(num * 100) / 100;
}

export function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
