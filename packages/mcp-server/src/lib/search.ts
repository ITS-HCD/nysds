/**
 * Search Utilities
 *
 * Fuzzy search functionality for components and tokens.
 */

import { getAllComponents } from "./cem-parser.js";

export interface SearchResult {
  tagName: string;
  name: string;
  summary: string;
  score: number;
}

/**
 * Simple fuzzy matching score
 * Returns a score between 0 and 1, where 1 is an exact match
 */
function fuzzyScore(query: string, text: string): number {
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

  // Character-by-character fuzzy match
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

  for (const component of components) {
    const tagName = component.tagName || "";
    const name = component.name || "";
    const description = component.description || "";
    const summary = component.summary || description.split("\n")[0] || "";

    // Calculate scores for different fields
    const tagScore = fuzzyScore(query, tagName) * 1.2; // Boost tag matches
    const nameScore = fuzzyScore(query, name) * 1.1;
    const summaryScore = fuzzyScore(query, summary);
    const descScore = fuzzyScore(query, description) * 0.8;

    const maxScore = Math.max(tagScore, nameScore, summaryScore, descScore);

    if (maxScore > 0) {
      results.push({
        tagName,
        name,
        summary,
        score: maxScore,
      });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Check if a string matches a search query
 */
export function matchesQuery(text: string, query: string): boolean {
  return fuzzyScore(query, text) > 0;
}
