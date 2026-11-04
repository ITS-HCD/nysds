/**
 * Search Utilities
 *
 * Search functionality for components.
 */

import { getAllComponents } from "./cem-parser.js";

export interface SearchResult {
  tagName: string;
  name: string;
  summary: string;
  score: number;
}

/**
 * Score a query against a short identifier (tag name or class name).
 * Returns a score between 0 and 1, where 1 is an exact match. Falls back to
 * an in-order character match ("btn" -> "nys-button"), which is only safe on
 * short identifiers: against prose it matches almost anything.
 */
function identifierScore(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Exact match
  if (lowerText === lowerQuery) return 1;

  // Contains exact query
  if (lowerText.includes(lowerQuery)) {
    // Bonus for matching at word boundaries
    const wordBoundary = new RegExp(`\\b${escapeRegex(lowerQuery)}`, "i");
    if (wordBoundary.test(lowerText)) {
      return 0.9;
    }
    return 0.7;
  }

  // "date picker" / "date-picker" -> "nys-datepicker"
  const compactQuery = lowerQuery.replace(/[\s_-]+/g, "");
  if (compactQuery && lowerText.replace(/-/g, "").includes(compactQuery)) {
    return 0.85;
  }

  // Character-by-character fuzzy match
  if (/\s/.test(lowerQuery) || lowerQuery.length < 3) return 0;

  let queryIndex = 0;
  let score = 0;
  let consecutiveBonus = 0;

  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      score += 1 + consecutiveBonus * 0.5;
      consecutiveBonus++;
      queryIndex++;
    } else {
      consecutiveBonus = 0;
    }
  }

  // Did we match all query characters?
  if (queryIndex < lowerQuery.length) {
    return 0;
  }

  // Normalize score
  return Math.min(score / (lowerQuery.length * 2), 0.6);
}

/**
 * Score a query against prose (summary or description). Every query word
 * must start a word in the text; the full phrase scores higher.
 */
function proseScore(query: string, text: string): number {
  if (!text) return 0;
  const lowerQuery = query.toLowerCase().trim();
  const phrase = new RegExp(`\\b${escapeRegex(lowerQuery)}`, "i");
  if (phrase.test(text)) return 0.8;

  const words = lowerQuery.split(/\s+/).filter((w) => w.length > 1);
  if (words.length < 2) return 0;
  const allWords = words.every((w) =>
    new RegExp(`\\b${escapeRegex(w)}`, "i").test(text),
  );
  return allWords ? 0.6 : 0;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Search components by name or description
 */
export function searchComponents(query: string): SearchResult[] {
  const components = getAllComponents();
  const results: SearchResult[] = [];
  const trimmed = query.trim();

  for (const component of components) {
    const tagName = component.tagName || "";
    const name = component.name || "";
    const description = component.description || "";
    const summary = component.summary || description.split("\n")[0] || "";

    // Calculate scores for different fields
    const tagScore = identifierScore(trimmed, tagName) * 1.2; // Boost tag matches
    const nameScore = identifierScore(trimmed, name) * 1.1;
    const summaryScore = proseScore(trimmed, summary);
    const descScore = proseScore(trimmed, description) * 0.75;

    const maxScore = Math.max(tagScore, nameScore, summaryScore, descScore);

    if (maxScore > 0) {
      results.push({
        tagName,
        name,
        summary,
        score: Math.round(maxScore * 100) / 100,
      });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
