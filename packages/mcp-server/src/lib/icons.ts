/**
 * NYSDS Icon Set
 *
 * The names of the icons built into nys-icon's "default" library, read from
 * the manifest @nysds/nys-icon generates from nys-icon.library.ts. Only these
 * names render without registering another library, so the MCP server lists
 * them instead of leaving agents to guess (and guess Material Symbols names).
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { CEMDeclaration } from "./cem-parser.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedNames: string[] | null = null;

/** Built-in NYSDS icon names, sorted. Empty if the manifest can't be found. */
export function getIconNames(): string[] {
  if (cachedNames) return cachedNames;
  const possiblePaths = [
    // Bundled data (copied at build time) — standalone installs
    resolve(__dirname, "../../data/icons/manifest.json"),
    // The nys-icon package in the monorepo (during development)
    resolve(__dirname, "../../../nys-icon/manifest.json"),
  ];
  const path = possiblePaths.find((p) => existsSync(p));
  if (!path) {
    console.error("NYSDS icon manifest not found; icon names unavailable.");
    return (cachedNames = []);
  }
  const { icons } = JSON.parse(readFileSync(path, "utf-8")) as {
    icons: string[];
  };
  return (cachedNames = [...icons].sort());
}

/**
 * Attributes on a component whose value is an icon name from the NYSDS set:
 * nys-icon's `name`, and other components' `icon`, `prefixIcon`,
 * `suffixIcon`, etc. Boolean flags such as `noIcon` aren't names.
 */
export function iconAttributes(component: CEMDeclaration): string[] {
  if (component.tagName === "nys-icon") return ["name"];
  return (component.attributes ?? [])
    .filter(
      (a) =>
        /icon$/i.test(a.name) && a.type?.text?.replace(/\s/g, "") !== "boolean",
    )
    .map((a) => a.name);
}

export const ICON_GUIDE_POINTER =
  'Only these names render by default. For an icon the NYSDS set doesn\'t have, register another library; see get_guide({ topic: "icons" }).';
