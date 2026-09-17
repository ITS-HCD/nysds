/** The form model shape asserted by the shared smoke tests. */
export interface FormsReadout {
  firstName: string;
  bio: string;
  state: string;
  county: string;
  dob: string;
  agree: boolean;
  languages: string[];
  contact: string;
  newsletter: boolean;
  /** File name of the chosen file; empty when none. */
  resume: string;
}

export const stateOptions = [
  { value: "NY", label: "New York" },
  { value: "NJ", label: "New Jersey" },
  { value: "CT", label: "Connecticut" },
];

export const countyOptions = [
  { value: "albany", label: "Albany" },
  { value: "kings", label: "Kings" },
  { value: "monroe", label: "Monroe" },
];

/** First file name out of whatever the files accessor produced. */
export function fileName(files: FileList | File[] | null | undefined): string {
  if (!files) return "";
  const first = Array.isArray(files) ? files[0] : files.item(0);
  return first?.name ?? "";
}
