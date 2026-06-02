// src/scripts/nysds-reporter.js

// --- Mode detection ---
function getMode() {
  const env = process.env.NYSDS_TEST_OUTPUT;
  if (env === 'compact') return 'compact';
  if (env === 'ai') return 'ai';
  return 'default';
}

// --- Color utilities ---
// Respect NO_COLOR convention: https://no-color.org/
function useColor() {
  return !process.env.NO_COLOR && getMode() !== 'ai';
}

const NYSDS_BLUE = '\x1b[38;2;36;95;194m'; // #245FC2
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[90m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';

function c(text, color) {
  if (!useColor()) return text;
  return `${color}${text}${RESET}`;
}

// --- Logo (multicolor with embedded ANSI — higher resolution) ---
const LOGO_LINES = [
  "\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m",
  "\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m",
  "\x1b[0m \x1b[0m \x1b[0m \x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m \x1b[0m \x1b[0m \x1b[0m",
  "\x1b[0m \x1b[0m \x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m \x1b[0m \x1b[0m",
  "\x1b[0m \x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;36;96;193m\x1b[48;2;14;50;80m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[0m \x1b[0m",
  "\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;36;96;193m\x1b[48;2;14;50;80m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[0m\x1b[38;2;36;96;193m\u2584\x1b[0m",
  "\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;14;50;80m\x1b[48;2;36;96;193m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;36;96;193m\x1b[48;2;14;50;80m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[0m",
  "\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;14;50;80m\x1b[48;2;36;96;193m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m",
  "\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m",
  "\x1b[0m\x1b[38;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m",
  "\x1b[0m \x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m \x1b[0m",
  "\x1b[0m \x1b[0m \x1b[0m\x1b[38;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;36;96;193m\u2580\x1b[38;2;36;96;193m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m \x1b[0m \x1b[0m",
  "\x1b[0m \x1b[0m \x1b[0m \x1b[0m\x1b[38;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;255;255;255m\u2580\x1b[38;2;255;255;255m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m \x1b[0m \x1b[0m \x1b[0m",
  "\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m\x1b[38;2;255;255;255m\u2580\x1b[0m\x1b[38;2;255;255;255m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m",
  "\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[38;2;14;50;80m\x1b[48;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m\x1b[38;2;14;50;80m\u2580\x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m \x1b[0m",
];

// Plain-text fallback for NO_COLOR / AI mode
const LOGO_PLAIN = [
  '      \u2584\u2584\u2584\u2584',
  '   \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2584',
  '  \u2588\u2588\u2588\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2588\u2588',
  ' \u2588\u2588\u2588\u2588\u2584\u2584\u2584    \u2588\u2588\u2588',
  '\u2590\u2588\u2588\u2588\u2588\u2588\u2580  \u2584  \u2588\u2588\u2588\u258C',
  ' \u2588\u2588\u2588\u2580  \u2584\u2588\u2588  \u2588\u2588\u2588',
  ' \u2580\u2580  \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588',
  '    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2580',
  '      \u2580\u2580\u2580\u2580',
];

function renderLogo() {
  return useColor() ? LOGO_LINES : LOGO_PLAIN;
}

// --- Formatting helpers ---
function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatRow(name, passed, failed, skipped, duration, timedOut) {
  if (timedOut) {
    const icon = c('✗', RED);
    const nameCol = name.padEnd(20);
    return `  ${icon} ${nameCol} ${c('timed out', RED)}`;
  }
  const icon = failed > 0 ? c('✗', RED) : c('✓', GREEN);
  const nameCol = name.padEnd(20);
  const countParts = [];
  if (passed > 0) countParts.push(c(`${passed} passed`, GREEN));
  if (failed > 0) countParts.push(c(`${failed} failed`, RED));
  if (skipped > 0) countParts.push(c(`${skipped} skipped`, YELLOW));
  const counts = countParts.join(', ');
  const timeCol = c(formatDuration(duration), DIM);
  return `  ${icon} ${nameCol} ${counts}  ${timeCol}`;
}

// --- Compact mode grouping ---
const COMPACT_GROUPS = [
  { name: 'tokens', match: (pkg) => pkg === 'tokens' },
  { name: 'styles', match: (pkg) => pkg === 'styles' },
  { name: 'components', match: (pkg) => pkg.startsWith('nys-') },
  { name: 'mcp-server', match: (pkg) => pkg === 'mcp-server' },
];

function groupResults(packageResults) {
  const groups = COMPACT_GROUPS.map(g => ({
    name: g.name,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    failures: [],
    failedPackages: [],
  }));

  for (const [pkg, r] of packageResults) {
    const groupIndex = COMPACT_GROUPS.findIndex(g => g.match(pkg));
    if (groupIndex === -1) continue;
    const group = groups[groupIndex];
    group.passed += r.passed;
    group.failed += r.failed;
    group.skipped += r.skipped;
    group.duration += r.duration;
    if (r.failed > 0) {
      group.failedPackages.push(pkg);
      group.failures.push(...r.failures);
    }
  }

  return groups.filter(g => g.passed + g.failed + g.skipped > 0);
}

// --- Package name extraction ---
function getPackageName(testFile) {
  const match = testFile.match(/packages\/([^/]+)\//);
  return match ? match[1] : testFile;
}

// --- Recursive test result counting ---
function countResults(suiteResult) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const failures = [];

  function walk(suite, path = []) {
    const suitePath = suite.name ? [...path, suite.name] : path;
    for (const test of suite.tests) {
      if (test.skipped) {
        skipped++;
      } else if (test.passed) {
        passed++;
      } else {
        failed++;
        const fullName = [...suitePath, test.name].join(' → ');
        failures.push({
          name: fullName,
          error: test.error,
        });
      }
    }
    for (const child of suite.suites) {
      walk(child, suitePath);
    }
  }

  walk(suiteResult);
  return { passed, failed, skipped, failures };
}

function walkDuration(suiteResult) {
  let total = 0;
  function walk(suite) {
    for (const test of suite.tests) {
      total += test.duration || 0;
    }
    for (const child of suite.suites) {
      walk(child);
    }
  }
  walk(suiteResult);
  return total;
}

// --- Spinner ---
const SPINNER = ['↗️ ', '➡️ ', '↘️ ', '⬇️ ', '↙️ ', '⬅️ ', '↖️ ', '⬆️ '];

// --- Reporter factory ---
export function nysdsReporter({ coverageThreshold = { statements: 0, functions: 0, branches: 0, lines: 0 } } = {}) {
  const mode = getMode();
  let startTime;
  let testFiles = [];
  let browserNames = [];
  const packageResults = new Map();
  let frame = 0;
  let browserCount = 0;

  return {
    start(args) {
      startTime = args.startTime;
      testFiles = args.testFiles;
      browserNames = args.browserNames;
    },

    reportTestFileResults({ logger, testFile, sessionsForTestFile }) {
      const pkg = getPackageName(testFile);

      // Track actual browser launcher count (not deduplicated product names)
      if (browserCount === 0) {
        browserCount = sessionsForTestFile.length;
      }

      // Aggregate results across all browser sessions for this file.
      // A test file runs once per browser (6 browsers = 6 sessions).
      // We use the first session with testResults for counts (tests are
      // the same across browsers), but check all sessions for failures.
      let passed = 0;
      let failed = 0;
      let skipped = 0;
      let duration = 0;
      const failures = [];
      let timedOut = !sessionsForTestFile.some(s => s.testResults);

      for (const session of sessionsForTestFile) {
        if (!session.testResults) continue;
        const counts = countResults(session.testResults);
        // Use the max counts across browsers (they should be equal
        // for pass/skip, but a test might fail in only one browser).
        passed = Math.max(passed, counts.passed);
        failed = Math.max(failed, counts.failed);
        skipped = Math.max(skipped, counts.skipped);

        // Collect failures with browser info
        for (const f of counts.failures) {
          const browserName = session.browser?.name || 'unknown';
          const existing = failures.find(e => e.name === f.name);
          if (existing) {
            if (!existing.browsers.includes(browserName)) {
              existing.browsers.push(browserName);
            }
          } else {
            failures.push({ ...f, browsers: [browserName] });
          }
        }
      }

      // Calculate duration from session timing
      for (const session of sessionsForTestFile) {
        if (session.testResults) {
          const sessionDuration = walkDuration(session.testResults);
          duration = Math.max(duration, sessionDuration);
        }
      }

      // If this package already has results (shouldn't happen with one
      // test file per package, but guard against it), merge them.
      if (packageResults.has(pkg)) {
        const existing = packageResults.get(pkg);
        existing.passed += passed;
        existing.failed += failed;
        existing.skipped += skipped;
        existing.duration += duration;
        existing.failures.push(...failures);
      } else {
        packageResults.set(pkg, { passed, failed, skipped, duration, failures, timedOut });
      }

      // Log details to the buffered logger so they appear above the
      // progress area and persist (not cleared on re-render).
      const sep = '-----------';
      const fileName = testFile.split('/').pop();

      // Format browser list with counts: ["Chromium","Webkit","Webkit","Webkit"] → "Chromium, Webkit (3)"
      function formatBrowserList(browsers) {
        const counts = {};
        for (const b of browsers) counts[b] = (counts[b] || 0) + 1;
        return Object.entries(counts)
          .map(([name, count]) => count > 1 ? `${name} (${count})` : name)
          .join(', ');
      }

      // 404 network requests
      const all404s = new Set();
      for (const session of sessionsForTestFile) {
        if (session.request404s) {
          for (const url of session.request404s) all404s.add(url);
        }
      }
      if (all404s.size > 0) {
        logger.log('');
        logger.log(`🟡 Warning: ${fileName}`);
        logger.log(sep);
        logger.log('404 network requests:');
        for (const url of all404s) {
          logger.log(`  - ${url}`);
        }
        logger.log('');
      }

      // Browser warning logs
      const browserLogs = new Set();
      for (const session of sessionsForTestFile) {
        if (session.logs) {
          for (const logArgs of session.logs) {
            const text = logArgs.map(a => String(a)).join(' ');
            browserLogs.add(text);
          }
        }
      }
      if (browserLogs.size > 0) {
        logger.log('');
        logger.log(`🟡 Warning: ${fileName}`);
        logger.log(sep);
        for (const text of browserLogs) {
          logger.log(text);
        }
        logger.log('');
      }

      // Timed out
      if (timedOut) {
        const allBrowsers = sessionsForTestFile.map(s => s.browser?.name || 'unknown');
        logger.log('');
        logger.log(`⏱️  Timeout: ${fileName}`);
        logger.log(sep);
        logger.log('Browser tests did not finish within the timeout.');
        logger.log(sep);
        logger.log(`👨‍💻 Browsers:  ${formatBrowserList(allBrowsers)}`);
        logger.log('');
      } else if (failures.length > 0) {
        for (const f of failures) {
          const err = f.error || {};
          const errName = err.name ? `${err.name}: ` : '';
          logger.log('');
          logger.log(`❌ Failure: ${fileName}`);
          logger.log(sep);
          logger.log(f.name);
          logger.log(sep);
          if (f.browsers?.length) {
            logger.log(`👨‍💻 Browsers:  ${f.browsers.length > 1 ? c(formatBrowserList(f.browsers), YELLOW) : formatBrowserList(f.browsers)}`);
          }
          logger.log(`🚫 Error:     ${c(`${errName}${err.message || 'Unknown error'}`, RED)}`);
          if (err.expected != null && err.actual != null) {
            logger.log(`🟢 Expected:  ${c(`+${err.expected}`, GREEN)}`);
            logger.log(`🔴 Actual:    ${c(`-${err.actual}`, RED)}`);
          }
          if (err.stack) {
            const stackLines = err.stack.split('\n');
            const locationLine = stackLines.find(l => l.includes('packages/'));
            if (locationLine) {
              logger.log(`👾 Stack:     ${c(locationLine.trim(), DIM)}`);
            }
          }
          logger.log('');
        }
      }
    },

    getTestProgress({ sessions, testRun, focusedTestFile, testCoverage }) {
      const lines = [];
      const termRows = process.stdout.rows || 40;

      // Logo (default and compact modes only)
      if (mode !== 'ai') {
        lines.push('');
        lines.push(...renderLogo());
        lines.push('');
      }

      // Header
      if (mode === 'ai') {
        lines.push('NYSDS Test Results');
      } else {
        lines.push(c('  @nysds', `${BOLD}${NYSDS_BLUE}`) + c(': Running test suites...', BOLD));
      }
      lines.push('');

      // Determine unique test files (one per package)
      const totalPackages = new Set(testFiles.map(f => getPackageName(f))).size;
      const completedCount = packageResults.size;

      if (mode === 'default') {
        // Default mode: one row per package, sorted alphabetically.
        // Cap visible rows to fit the terminal (reserve lines for
        // header/logo above + summary/progress below).
        const sorted = [...packageResults.entries()].sort((a, b) => a[0].localeCompare(b[0]));
        const reservedLines = lines.length + 10; // logo/header above + summary below
        const maxRows = Math.max(5, termRows - reservedLines);

        if (sorted.length <= maxRows) {
          for (const [pkg, r] of sorted) {
            lines.push(formatRow(pkg, r.passed, r.failed, r.skipped, r.duration, r.timedOut));
          }
        } else {
          // Always show failed/timed-out packages; truncate passing ones from the middle.
          const problematic = sorted.filter(([, r]) => r.failed > 0 || r.timedOut);
          const ok = sorted.filter(([, r]) => r.failed === 0 && !r.timedOut);
          const slotsForOk = maxRows - 1 - problematic.length; // -1 for truncation marker

          if (slotsForOk >= ok.length || slotsForOk < 1) {
            for (const [pkg, r] of sorted) {
              lines.push(formatRow(pkg, r.passed, r.failed, r.skipped, r.duration, r.timedOut));
            }
          } else {
            const topCount = Math.floor(slotsForOk / 2);
            const bottomCount = slotsForOk - topCount;
            const visibleOk = new Set([
              ...ok.slice(0, topCount).map(([pkg]) => pkg),
              ...ok.slice(-bottomCount).map(([pkg]) => pkg),
            ]);
            const hidden = ok.length - visibleOk.size;

            let markerShown = false;
            for (const [pkg, r] of sorted) {
              if (r.failed > 0 || r.timedOut || visibleOk.has(pkg)) {
                lines.push(formatRow(pkg, r.passed, r.failed, r.skipped, r.duration, r.timedOut));
              } else if (!markerShown) {
                lines.push(c(`    ... ${hidden} more passed ...`, DIM));
                markerShown = true;
              }
            }
          }
        }
      } else if (mode === 'compact') {
        const groups = groupResults(packageResults);
        for (const g of groups) {
          lines.push(formatRow(g.name, g.passed, g.failed, g.skipped, g.duration));
          // If the group has failures, list failing packages indented below
          if (g.failedPackages.length > 0) {
            for (const failedPkg of g.failedPackages) {
              const r = packageResults.get(failedPkg);
              lines.push(`      ${c('↳', DIM)} ${c(failedPkg, RED)}: ${r.failed} failed`);
            }
          }
        }
      } else {
        // AI mode — inline failure details right after the failing package row
        for (const [pkg, r] of [...packageResults.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
          const status = r.failed > 0 ? 'FAIL' : 'PASS';
          const total = r.passed + r.failed + r.skipped;
          lines.push(`${status} ${pkg} ${r.passed}/${total} ${formatDuration(r.duration)}`);
          if (r.failures.length > 0) {
            for (const f of r.failures) {
              const msg = f.error?.message || 'Unknown error';
              lines.push(`  FAIL "${f.name}" — ${msg}`);
            }
          }
        }
      }

      // Progress indicator (while still running)
      if (completedCount < totalPackages) {
        lines.push('');
        if (mode === 'ai') {
          lines.push(`PROGRESS ${completedCount}/${totalPackages} packages`);
        } else if (completedCount === 0) {
          const spinner = SPINNER[frame++ % SPINNER.length];
          // Check session statuses to show what's actually happening
          const allSessions = sessions ? [...sessions] : [];
          const testing = allSessions.filter(s => s.status === 'TEST_STARTED').length;
          if (testing > 0) {
            lines.push(`  ${spinner}Running tests across ${testing} browser sessions...`);
          } else {
            lines.push(`  ${spinner}Starting browsers...`);
          }
        } else {
          lines.push(c(`  Running... ${completedCount}/${totalPackages} packages complete`, DIM));
        }
      }

      // Summary (when all done)
      if (completedCount === totalPackages && completedCount > 0) {
        const totalPassed = [...packageResults.values()].reduce((sum, r) => sum + r.passed, 0);
        const totalFailed = [...packageResults.values()].reduce((sum, r) => sum + r.failed, 0);
        const totalSkipped = [...packageResults.values()].reduce((sum, r) => sum + r.skipped, 0);
        const totalTimedOut = [...packageResults.values()].filter(r => r.timedOut).length;
        const totalTests = totalPassed + totalFailed + totalSkipped;
        const durationMs = Date.now() - startTime;
        const numBrowsers = browserCount || browserNames.length;

        // Coverage — check all four metrics against thresholds
        const cov = testCoverage?.summary;
        const hasCoverage = cov?.lines?.pct != null && cov.lines.pct !== 'Unknown';
        const coveragePassed = !hasCoverage || (
          (cov.statements?.pct ?? 100) >= (coverageThreshold.statements ?? 0) &&
          (cov.functions?.pct   ?? 100) >= (coverageThreshold.functions   ?? 0) &&
          (cov.branches?.pct    ?? 100) >= (coverageThreshold.branches    ?? 0) &&
          (cov.lines?.pct       ?? 100) >= (coverageThreshold.lines       ?? 0)
        );
        const allPassed = totalFailed === 0 && totalTimedOut === 0 && coveragePassed;

        if (mode === 'ai') {
          // AI summary (failure details already inline above each FAIL row)
          lines.push(`TOTAL ${completedCount} files, ${totalPassed}/${totalTests} passed, ${formatDuration(durationMs)}, ${numBrowsers} browsers`);
          if (hasCoverage) {
            lines.push(`COVERAGE statements=${cov.statements?.pct}% functions=${cov.functions?.pct}% branches=${cov.branches?.pct}% lines=${cov.lines?.pct}%`);
            if (!coveragePassed) lines.push(`COVERAGE_FAIL thresholds not met (statements=${coverageThreshold.statements}% functions=${coverageThreshold.functions}% branches=${coverageThreshold.branches}% lines=${coverageThreshold.lines}%)`);
          }
          lines.push(`STATUS ${allPassed ? 'PASS' : 'FAIL'}`);
        } else {
          // Default/compact summary
          lines.push('');
          const passedFiles = [...packageResults.values()].filter(r => r.failed === 0 && !r.timedOut).length;
          const failedFiles = completedCount - passedFiles;

          lines.push(`  ${c('Test Files:', BOLD)}  ${c(`${passedFiles} passed`, GREEN)}${failedFiles > 0 ? `, ${c(`${failedFiles} failed`, RED)}` : ''} (${completedCount})`);
          lines.push(`  ${c('Tests:', BOLD)}      ${c(`${totalPassed} passed`, GREEN)}${totalFailed > 0 ? `, ${c(`${totalFailed} failed`, RED)}` : ''}${totalSkipped > 0 ? `, ${c(`${totalSkipped} skipped`, YELLOW)}` : ''}${totalTimedOut > 0 ? `, ${c(`${totalTimedOut} timed out`, RED)}` : ''} (${totalTests})`);
          lines.push(`  ${c('Browsers:', BOLD)}   ${numBrowsers}`);
          lines.push(`  ${c('Duration:', BOLD)}   ${formatDuration(durationMs)}`);
          if (hasCoverage) {
            lines.push(`  ${c('Coverage:', BOLD)}   ${cov.lines?.pct}%`);
            lines.push(`  ${c('Report:', BOLD)}     coverage/lcov-report/index.html`);
          }
          lines.push('');

          if (allPassed) {
            lines.push(`  ${c('✓', GREEN)} ${c('All test suites passed!', `${BOLD}${GREEN}`)}`);
          } else {
            lines.push(`  ${c('✗', RED)} ${c(`${totalFailed} test${totalFailed === 1 ? '' : 's'} failed.`, `${BOLD}${RED}`)}`);
          }
        }
      }

      lines.push('');
      return lines;
    },
  };
}
