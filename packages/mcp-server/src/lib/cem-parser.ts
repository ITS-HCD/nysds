/**
 * Custom Elements Manifest Parser
 *
 * Reads and parses the custom-elements.json manifest from @nysds/components.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Type definitions for Custom Elements Manifest
export interface CEMAttribute {
  name: string;
  type?: { text: string };
  default?: string;
  description?: string;
  fieldName?: string;
}

export interface CEMMember {
  kind: "field" | "method";
  name: string;
  type?: { text: string };
  default?: string;
  description?: string;
  privacy?: "public" | "private" | "protected";
  attribute?: string;
}

export interface CEMEvent {
  name: string;
  type?: { text: string };
  description?: string;
}

export interface CEMSlot {
  name: string;
  description?: string;
}

export interface CEMCssProperty {
  name: string;
  default?: string;
  description?: string;
}

export interface CEMCssPart {
  name: string;
  description?: string;
}

export interface CEMDeclaration {
  kind: "class";
  name: string;
  tagName?: string;
  summary?: string;
  description?: string;
  attributes?: CEMAttribute[];
  members?: CEMMember[];
  events?: CEMEvent[];
  slots?: CEMSlot[];
  cssProperties?: CEMCssProperty[];
  cssParts?: CEMCssPart[];
  superclass?: { name: string; package?: string };
}

export interface CEMModule {
  kind: "javascript-module";
  path: string;
  declarations?: CEMDeclaration[];
  exports?: Array<{ kind: string; name: string; declaration: { name: string } }>;
}

export interface CustomElementsManifest {
  schemaVersion: string;
  readme?: string;
  modules: CEMModule[];
}

let cachedCEM: CustomElementsManifest | null = null;

/**
 * Get the path to the custom-elements.json file
 */
function getCEMPath(): string {
  // Try multiple locations
  const possiblePaths = [
    // Relative to the package (when installed as dependency)
    resolve(__dirname, "../../../node_modules/@nysds/components/dist/custom-elements.json"),
    // Relative to monorepo root (during development)
    resolve(__dirname, "../../../../dist/custom-elements.json"),
    // Direct path for testing
    resolve(process.cwd(), "dist/custom-elements.json"),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error(
    `custom-elements.json not found. Searched paths:\n${possiblePaths.join("\n")}`
  );
}

/**
 * Load and parse the Custom Elements Manifest
 */
export function getCEM(): CustomElementsManifest {
  if (cachedCEM) {
    return cachedCEM;
  }

  try {
    const cemPath = getCEMPath();
    const content = readFileSync(cemPath, "utf-8");
    cachedCEM = JSON.parse(content) as CustomElementsManifest;
    return cachedCEM;
  } catch (error) {
    // Return empty manifest if file not found (for development/testing)
    console.error("Warning: Could not load custom-elements.json:", error);
    return {
      schemaVersion: "1.0.0",
      modules: [],
    };
  }
}

/**
 * Get all component declarations from the manifest
 */
export function getAllComponents(): CEMDeclaration[] {
  const cem = getCEM();
  const components: CEMDeclaration[] = [];

  for (const module of cem.modules) {
    if (module.declarations) {
      for (const declaration of module.declarations) {
        if (declaration.kind === "class" && declaration.tagName) {
          components.push(declaration);
        }
      }
    }
  }

  return components.sort((a, b) =>
    (a.tagName || "").localeCompare(b.tagName || "")
  );
}

/**
 * Get a specific component by tag name
 */
export function getComponent(tagName: string): CEMDeclaration | undefined {
  const components = getAllComponents();
  return components.find(
    (c) => c.tagName?.toLowerCase() === tagName.toLowerCase()
  );
}

/**
 * Clear the cached CEM (useful for testing)
 */
export function clearCache(): void {
  cachedCEM = null;
}
