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
      <input form=${args.id} id="fname" type="text" name="fname" />
      <button form=${args.id} type="submit">Send</button>
    </nys-form>
    <label for="lname">Enter last name: </label>
    <input form=${args.id} id="lname" type="text" name="lname" />
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="my-form">
  <label for="fname">Enter first name: </label>
  <input form="my-form" id="fname" type="text" value="fname" />
  <button form="my-form" type="submit"> Send </button>
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
      <input form=${args.id} id="fname" type="text" name="fname" />
      <button form=${args.id} type="submit">Send</button>
    </nys-form>
    <label for="lname">Enter last name: </label>
    <input form=${args.id} id="lname" type="text" name="lname" />
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form id="my-form">
  <label for="fname">Enter first name: </label>
  <input form="my-form" id="fname" type="text" value="fname" />
  <button form="my-form" type="submit"> Send </button>
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
    id: "my-form",
    fieldset: true,
    legend: "Primary work location",
  },
  render: (args) => html`
    <nys-form .id=${args.id} ?fieldset=${args.fieldset} legend=${args.legend}>
      <input
        form="my-form"
        type="radio"
        id="albany"
        name="office"
        value="albany"
      />
      <label for="albany">Albany</label><br />

      <input
        form="my-form"
        type="radio"
        id="manhattan"
        name="office"
        value="manhattan"
      />
      <label for="manhattan">Manhattan</label><br />

      <input
        form="my-form"
        type="radio"
        id="remote"
        name="office"
        value="remote"
      />
      <label for="remote">Remote</label>
      <button form=${args.id} type="submit">Send</button>
    </nys-form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form 
  id="my-form"
  fieldset
  legend="Location">
    <input type="radio" id="kraken" name="monster" value="K" />
    <label for="kraken">Kraken</label><br />

    <input type="radio" id="sasquatch" name="monster" value="S" />
    <label for="sasquatch">Sasquatch</label><br />

    <input type="radio" id="mothman" name="monster" value="M" />
    <label for="mothman">Mothman</label>
    <button form="my-form" type="submit"> Send </button>
</nys-form>
`.trim(),
        type: "auto",
      },
    },
  },
};
