import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-form";
import "../../nys-checkbox/src/index.ts"; // references: "/packages/nys-checkbox/dist/nys-checkbox.es.js";
import "../../nys-radiobutton/src/index.ts"; // references: "/packages/nys-radiobutton/dist/nys-radiobutton.es.js";
import "../../nys-select/src/index.ts"; // references: "/packages/nys-select/dist/nys-select.es.js";
import "../../nys-textarea/src/index.ts"; // references: "/packages/nys-textarea/dist/nys-textarea.es.js";
import "../../nys-textinput/src/index.ts"; // references: "/packages/nys-textinput/dist/nys-textinput.es.js";
import "../../nys-toggle/src/index.ts"; // references: "/packages/nys-toggle/dist/nys-toggle.es.js";

// Define the structure of the args used in the stories
interface NysFormArgs {
  id: string;
  fieldset?: boolean;
  legend?: string;
}

const meta: Meta<NysFormArgs> = {
  title: "Components/Form",
  component: "nys-form",
  argTypes: {
    id: { control: "text" },
    fieldset: { control: "boolean" },
    legend: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysFormArgs>;

/******************************** CUSTOM FUNCTION ********************************/
/**
 * Example custom function to process FormData.
 * Demonstrates how developers might handle the `nys-submitForm` event bubbled up from <nys-form>.
 * Converts FormData into a key-value object for easier manipulation,
 * logs the processed and raw data, and displays it in an alert.
 */
const useData = (formData: FormData) => {
  const formValues: Record<string, string> = {};
  formData.forEach((value, key) => {
    formValues[key] = value.toString();
  });

  console.log("Processed Form Values:", formValues);
  console.log("Raw FormData:", formData);
  alert(JSON.stringify(formValues, null, 2));
};

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Form
export const Form: Story = {
  args: {
    id: "my-form-id",
  },
  render: (args) => html`
    <nys-form
      .id=${args.id}
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @nys-submitForm=${(e: CustomEvent) => {
        const formData = e.detail; // access FormData from the event detail
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <label for="my-form-id">Enter first name: </label>
      <input id="fname" type="text" name="fname" />
    </nys-form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="my-form-id">
  <label for="fname">Enter first name: </label>
  <input id="fname" type="text" value="fname" />
</nys-form>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Handling FormData
export const HandlingSubmission: Story = {
  args: {
    id: "username-form",
  },
  render: (args) => html`
    <nys-form
      .id=${args.id}
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @nys-submitForm=${(e: CustomEvent) => {
        const formData = e.detail; // access FormData from the event detail
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <label for="fname">Enter username: </label>
      <input id="fname" type="text" name="fname" />
      <div style="display:flex; gap:5px;">
        <label for="mailing-list">Subscribe to our mailing list? </label>
        <input id="mailing-list" type="checkbox" name="mailing-list" />
      </div>
      <button type="submit">Send</button>
    </nys-form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="username-form">
  <label for="fname">Enter username: </label>
  <input id="fname" type="text" value="fname" />
  <div style="display:flex; gap:5px;">
    <label for="mailing-list">Subscribe to our mailing list? </label>
    <input id="mailing-list" type="checkbox" name="mailing-list" />
  </div>
  <button type="submit"> Send </button>
</nys-form>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Fieldset and Legend
export const Fieldset: Story = {
  args: {
    id: "work-location",
    fieldset: true,
    legend: "Primary work location",
  },
  render: (args) => html`
    <nys-form
      .id=${args.id}
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @nys-submitForm=${(e: CustomEvent) => {
        const formData = e.detail; // access FormData from the event detail
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <input type="radio" id="albany" name="office" value="albany" />
      <label for="albany">Albany</label><br />

      <input type="radio" id="manhattan" name="office" value="manhattan" />
      <label for="manhattan">Manhattan</label><br />

      <input type="radio" id="remote" name="office" value="remote" />
      <label for="remote">Remote</label>

      <div style="display:flex; margin:20px 0;">
        <select name="state" id="state-select">
          <option value="">--Please choose an option--</option>
          <option value="nj">New Jersey</option>
          <option value="ny">New York</option>
          <option value="pa">Pennsylvania</option>
          <option value="ma">Massachusetts</option>
          <option value="vt">Vermont</option>
          <option value="ct">Connecticut</option>
        </select>
      </div>
      <button type="submit">Send</button>
    </nys-form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form 
  id="work-location"
  fieldset
  legend="Location">
    <input type="radio" id="albany" name="office" value="albany" />
    <label for="albany">Albany</label><br />

    <input type="radio" id="manhattan" name="office" value="manhattan" />
    <label for="manhattan">Manhattan</label><br />

    <input type="radio" id="remote" name="office" value="remote" />
    <label for="remote">Remote</label>

    <div style="display:flex; margin:20px;">
      <select name="state" id="state-select">
        <option value="">--Please choose an option--</option>
        <option value="nj">New Jersey</option>
        <option value="ny">New York</option>
        <option value="pa">Pennsylvania</option>
        <option value="ma">Massachusetts</option>
        <option value="vt">Vermont</option>
        <option value="ct">Connecticut</option>
      </select>
    </div>
    <button type="submit"> Send </button>
</nys-form>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Outside Form Elements
export const OutsideFormElements: Story = {
  args: {
    id: "user-info-form",
  },
  render: (args) => html`
    <nys-form
      .id=${args.id}
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @nys-submitForm=${(e: CustomEvent) => {
        const formData = e.detail; // access FormData from the event detail
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <label for="fname">Enter first name: </label>
      <input id="fname" type="text" name="fname" placeholder="I'm inside the form!" />
    </nys-form>
    <div style="display:flex; gap:10px; margin:20px 0;">
      <label for="lname">Enter last name: </label>
      <input form=${args.id} id="lname" type="text" name="lname" placeholder="I'm outside the form!" />
      <button form=${args.id} type="submit">Send</button>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="user-info-form">
  <label for="fname">Enter first name: </label>
  <input id="fname" type="text" name="fname" placeholder="I'm inside the form!" />
</nys-form>
<div style="display:flex; gap:10px; margin:20px 0;">
  <label for="lname">Enter last name: </label>
  <input form="user-info-form" id="lname" type="text" name="lname" placeholder="I'm outside the form!" />
  <button form="user-info-form" type="submit">Send</button>
</div>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: NYS Custom Web Components
export const nysComponents: Story = {
  args: {
    id: "nys-work-form",
  },

  render: (args) => html`
    <nys-form
      .id=${args.id}
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @nys-submitForm=${(e: CustomEvent) => {
        const formData = e.detail; // access FormData from the event detail
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <label for="fname">Enter first name: </label>
      <input id="fname" type="text" name="fname" placeholder="Did you know I'm a native HTML element?"/>
      <nys-textinput
        name="empid"
        placeholder="N00000000"
        label="Please enter your Employee number"
        description="include the N prefix"
        maxlength="9"
        pattern="N[0-9]{8}"
        id="nID"
      ></nys-textinput>
      <nys-checkbox
        label="NYS Resident?"
        description="Please check the box if you are a resident of New York State."
        name="nys-resident"
        value="nys-resident"
      ></nys-checkbox>
      <nys-radiogroup>
        <p>What is your primary work location?</p>
        <nys-radiobutton
          label="Albany"
          description="Upstate New York"
          name="office"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          label="Manhattan"
          description="New York City"
          name="office"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
      <nys-select
        name="favorite-borough"
        label="Select your favorite borough"
        description="Valid sizes are xs, sm, md, lg, and xl"
        size="xs"
      >
        <option value="bronx">The Bronx</option>
        <option value="brooklyn">Brooklyn</option>
        <option value="manhattan">Manhattan</option>
        <option value="staten_island">Staten Island</option>
        <option value="queens">Queens</option>
      </nys-select>
      <nys-textarea
        name="additional-feedback"
        label="Additional Feedback"
        description="You cannot type more than 10 characters in the below field"
        maxlength="10"
        required
      >
      </nys-textarea>
      <nys-toggle
        label="Dark Mode"
        name="dark-mode"
        value="dark"
      ></nys-toggle>
      <button type="submit">Send</button>
    </nys-form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="nys-work-form">
  <label for="fname">Enter first name: </label>
  <input id="fname" type="text" name="fname" placeholder="Did you know I'm a native HTML element?"/>
  <nys-textinput
    name="empid"
    placeholder="N00000000"
    label="Please enter your Employee number"
    description="include the N prefix"
    maxlength="9"
    pattern="N[0-9]{8}"
    id="nID"
  ></nys-textinput>
  <nys-checkbox
    label="NYS Resident?"
    description="Please check the box if you are a resident of New York State."
    name="nys-resident"
    value="nys-resident"
  ></nys-checkbox>
  <nys-radiogroup>
    <p>What is your primary work location?</p>
    <nys-radiobutton
      label="Albany"
      description="Upstate New York"
      name="office"
      value="albany"
    ></nys-radiobutton>
    <nys-radiobutton
      label="Manhattan"
      description="New York City"
      name="office"
      value="manhattan"
    ></nys-radiobutton>
  </nys-radiogroup>
  <nys-select
    name="favorite-borough"
    label="Select your favorite borough"
    description="Valid sizes are xs, sm, md, lg, and xl"
    size="xs"
  >
    <option value="bronx">The Bronx</option>
    <option value="brooklyn">Brooklyn</option>
    <option value="manhattan">Manhattan</option>
    <option value="staten_island">Staten Island</option>
    <option value="queens">Queens</option>
  </nys-select>
  <nys-textarea
    name="additional-feedback"
    label="Additional Feedback"
    description="You cannot type more than 10 characters in the below field"
    maxlength="10"
    required
  >
  </nys-textarea>
  <nys-toggle
    label="Dark Mode"
    name="dark-mode"
    value="dark"
  ></nys-toggle>
  <button type="submit">Send</button>
</nys-form>
`.trim(),
        type: "auto",
      },
    },
  },
};
