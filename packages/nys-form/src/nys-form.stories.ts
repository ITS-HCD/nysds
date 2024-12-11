import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-form";

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
 * Demonstrates how developers might handle the `nys-formSubmitted` event bubbled up from <nys-form>.
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
      @nys-formSubmitted=${(e: CustomEvent) => {
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
    id: "my-form",
  },
  render: (args) => html`
    <nys-form
      .id=${args.id}
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @nys-formSubmitted=${(e: CustomEvent) => {
        const formData = e.detail; // access FormData from the event detail
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <label for="fname">Enter first name: </label>
      <input id="fname" type="text" name="fname" />
      <button type="submit">Send</button>
    </nys-form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="my-form">
  <label for="fname">Enter first name: </label>
  <input id="fname" type="text" value="fname" />
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
      @nys-formSubmitted=${(e: CustomEvent) => {
        const formData = e.detail; // access FormData from the event detail
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <label for="fname">Enter first name: </label>
      <input id="fname" type="text" name="fname" />
      <button type="submit">Send</button>
    </nys-form>
    <div>
      <label for="lname">Enter last name: </label>
      <input form=${args.id} id="lname" type="text" name="lname" />
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="user-info-form">
  <label for="fname">Enter first name: </label>
  <input id="fname" type="text" value="fname" />
  <button type="submit"> Send </button>
</nys-form>
<div>
  <label for="lname">Enter last name: </label>
  <input form="user-info-form" id="lname" type="text" name="lname" />
</div>
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
    <nys-form .id=${args.id} ?fieldset=${args.fieldset} legend=${args.legend}>
      <input
        type="radio"
        id="albany"
        name="office"
        value="albany"
      />
      <label for="albany">Albany</label><br />

      <input
        type="radio"
        id="manhattan"
        name="office"
        value="manhattan"
      />
      <label for="manhattan">Manhattan</label><br />

      <input
        type="radio"
        id="remote"
        name="office"
        value="remote"
      />
      <label for="remote">Remote</label>

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

    <input type="radio" id="remote" name="office" value="M" />
    <label for="remote">Remote</label>
    <button type="submit"> Send </button>
</nys-form>
`.trim(),
        type: "auto",
      },
    },
  },
};
