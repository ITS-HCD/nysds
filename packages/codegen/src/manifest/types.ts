/**
 * Metadata types. Declared once in `cem-plugins/lib/core.d.mts` (next to the
 * runtime rules) and re-exported here so the TypeScript API and the plugins
 * can never disagree.
 */
export type {
  Manifest,
  ManifestModule,
  ComponentMeta,
  PropMeta,
  EventMeta,
  SlotMeta,
  FormControlMeta,
} from "../../cem-plugins/lib/core.mjs";
