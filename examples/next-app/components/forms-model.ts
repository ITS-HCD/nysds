/** The form model shared by every forms variant and asserted by the smoke tests. */
export interface FormsModel {
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

export const initialModel: FormsModel = {
  firstName: "",
  bio: "",
  state: "",
  county: "",
  dob: "",
  agree: false,
  languages: [],
  contact: "",
  newsletter: false,
  resume: "",
};

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
