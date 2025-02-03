import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "@nys-excelsior/nys-checkbox";
import "@nys-excelsior/nys-radiobutton";
import "@nys-excelsior/nys-select";
import "@nys-excelsior/nys-textarea";
import "@nys-excelsior/nys-textinput";
import "@nys-excelsior/nys-toggle";
import "@nys-excelsior/nys-button";

// Define the structure of the args used in the stories
interface NysFormArgs {
  id: string;
}

const meta: Meta<NysFormArgs> = {
  title: "Components/Form",
  component: "nys-form",
  argTypes: {
    id: { control: "text" },
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
 * Demonstrates how developers might handle the `nys-submit` event bubbled up from <nys-form>.
 * Converts FormData into a key-value object for easier manipulation,
 * logs the processed and raw data, and displays it in an alert.
 */
const useData = (formData: FormData) => {
  const formValues: Record<string, string> = {};
  formData.forEach((value, key) => {
    console.log(`This is the formData key: ${key} and value: ${value}`);
    formValues[key] = value.toString();
  });

  alert(JSON.stringify(formValues, null, 2));
};

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Native Form with Custom Web Components
export const Basic: Story = {
  args: {
    id: "nys-registration-form",
  },

  render: (args) => html`
    <h2>New York State Employee Registration</h2>
    <form
      .id=${args.id}
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const isFormValid = form.checkValidity();

        if (!isFormValid) {
          console.log("Form validation failed.");
          return;
        }

        console.log(
          "You should not be seeing this message if validation is suppose to fail. Otherwise, success!",
        );
        const formData = new FormData(e.target as HTMLFormElement);
        // Convert FormData to a simple object for easier logging
        const formDataObj: Record<string, any> = {};
        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });
        alert("Form Data:\n" + JSON.stringify(formDataObj, null, 2));
      }}
      style="display: flex; flex-direction: column; gap: var(--nys-space-200, 16px)"
    >
      <div
        style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap"
      >
        <nys-textinput
          label="Email"
          name="user-email"
          id="user-email"
          description="Used to send you a monthly update on your account."
          placeholder="John.Smith@its.ny.gov"
          type="text"
          width="lg"
        ></nys-textinput>
        <nys-checkboxgroup label="Opt In" description="Newsletter">
          <nys-checkbox
            label="Send me updates"
            name="newsletter"
            value="newsletter"
          ></nys-checkbox>
        </nys-checkboxgroup>
      </div>
      <div
        style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap"
      >
        <nys-textinput
          name="fname"
          label="First Name"
          id="fname"
          placeholder="John"
          type="text"
          width="md"
          required
        ></nys-textinput>
        <nys-textinput
          name="mname"
          label="Middle Name"
          id="mname"
          type="text"
          width="full"
        ></nys-textinput>
        <nys-textinput
          name="lname"
          label="Last Name"
          id="lname"
          placeholder="Smith"
          type="text"
          width="md"
          required
        ></nys-textinput>
      </div>
      <nys-select
        name="nys-agency"
        label="NYS Agency"
        id="nys-agency"
        description="Select the agency name/code you work for."
        width="lg"
      >
        <nys-option value="its(01110)" label="ITS (01110)"></nys-option>
        <nys-option value="dot(17060)" label="DoT (17060)"></nys-option>
        <nys-option value="ocfs(25000)" label="OCFS (25000)"></nys-option>
        <nys-option value="oag(03000)" label="OAG (03000)"></nys-option>
        <nys-option value="others" label="others"></nys-option>
      </nys-select>
      <div
        style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap"
      >
        <nys-textinput
          name="telephone"
          label="Phone Number"
          id="tele"
          placeholder="( )___-___"
          type="tel"
          width="md"
        ></nys-textinput>
        <nys-textinput
          name="tele-extension"
          label="Ext. (Optional)"
          id="ext"
          type="number"
          width="sm"
        ></nys-textinput>
      </div>
      <nys-textarea name="comments" label="Comments"></nys-textarea>
      <nys-radiogroup
        label="What is your primary work location?"
        description="This is the location you use for your in office days."
        size="md"
        required
      >
        <nys-radiobutton
          name="office"
          label="Albany"
          description="Upstate New York"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="office"
          label="Manhattan"
          description="New York City"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
      <nys-toggle label="Dark Mode" name="dark-mode" value="dark"></nys-toggle>
      <button type="submit">Send</button>
      <nys-button
        size="sm"
        type="button"
        .onClick=${() => alert("Button clicked")}
        label="Click me"
      ></nys-button>
      <nys-button size="sm" label="Submit" type="submit"></nys-button>
    </form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<form id="nys-work-form">
  <div
    style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap"
  >
    <nys-textinput
      label="Email"
      name="user-email"
      id="user-email"
      description="Used to send you a monthly update on your account."
      placeholder="John.Smith@its.ny.gov"
      type="text"
      width="lg"
    ></nys-textinput>
    <nys-checkboxgroup label="Opt In" description="Newsletter">
      <nys-checkbox
        label="Send me updates"
        name="newsletter"
        value="newsletter"
      ></nys-checkbox>
    </nys-checkboxgroup>
  </div>
  <div
    style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap"
  >
    <nys-textinput
      name="fname"
      label="First Name"
      id="fname"
      placeholder="John"
      type="text"
      width="md"
      required
    ></nys-textinput>
    <nys-textinput
      name="mname"
      label="Middle Name"
      id="mname"
      type="text"
      width="full"
    ></nys-textinput>
    <nys-textinput
      name="lname"
      label="Last Name"
      id="lname"
      placeholder="Smith"
      type="text"
      width="md"
      required
    ></nys-textinput>
  </div>
  <nys-select
    name="nys-agency"
    label="NYS Agency"
    id="nys-agency"
    description="Select the agency name/code you work for."
    width="lg"
  >
    <nys-option value="its(01110)" label="ITS (01110)"></nys-option>
    <nys-option value="dot(17060)" label="DoT (17060)"></nys-option>
    <nys-option value="ocfs(25000)" label="OCFS (25000)"></nys-option>
    <nys-option value="oag(03000)" label="OAG (03000)"></nys-option>
    <nys-option value="others" label="others"></nys-option>
  </nys-select>
  <div
    style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap"
  >
    <nys-textinput
      name="telephone"
      label="Phone Number"
      id="tele"
      placeholder="( )___-___"
      type="tel"
      width="md"
    ></nys-textinput>
    <nys-textinput
      name="tele-extension"
      label="Ext. (Optional)"
      id="ext"
      type="number"
      width="sm"
    ></nys-textinput>
  </div>
  <nys-textarea name="comments" label="Comments"> </nys-textarea>
  <nys-radiogroup
    label="What is your primary work location?"
    description="This is the location you use for your in office days."
    size="md"
    required
  >
    <nys-radiobutton
      name="office"
      label="Albany"
      description="Upstate New York"
      value="albany"
    ></nys-radiobutton>
    <nys-radiobutton
      name="office"
      label="Manhattan"
      description="New York City"
      value="manhattan"
    ></nys-radiobutton>
  </nys-radiogroup>
  <nys-toggle label="Dark Mode" name="dark-mode" value="dark"></nys-toggle>
  <nys-button size="sm" label="Submit" type="submit"></nys-button>
</form>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Handling Required Fields
export const RequiredFields: Story = {
  args: {
    id: "username-form",
  },
  render: (args) => html`
    <form
      .id=${args.id}
      @submit=${(e: SubmitEvent) => {
        console.log(
          "Form submitted...you should not see this message if validation fails.",
        );
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
      style="display: flex; flex-direction: column; gap: 10px;"
    >
      <nys-textinput
        name="username"
        placeholder="John Doe"
        label="Enter username:"
        description="Doesn't have to be your real name"
        id="username"
        type="text"
        required
      ></nys-textinput>
      <nys-checkbox
        label="Subscribe to our mailing list?"
        description="Please check the box if you are want to subscribe."
        name="mailing-list"
        value="mailing-list"
        required
      ></nys-checkbox>
      <nys-button size="sm" label="Submit" type="submit"></nys-button>
    </form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<form id="username-form">
  <nys-textinput
    name="username"
    placeholder="John Doe"
    label="Enter username:"
    description="Doesn't have to be your real name"
    id="username"
    type="text"
    required
  ></nys-textinput>
  <nys-checkbox
    label="Subscribe to our mailing list?"
    description="Please check the box if you are want to subscribe."
    name="mailing-list"
    value="mailing-list"
  ></nys-checkbox>
  <nys-button size="sm" label="Submit" type="submit"></nys-button>
</form>
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
    <form
      .id=${args.id}
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
      style="display: flex; flex-direction: column; gap: 10px; background-color: #f0f0f0; padding: 20px;"
    >
      <nys-textinput
        name="fname"
        placeholder="I'm inside the form!"
        label="First name:"
        description="Enter your legal first name"
        id="fname"
        type="text"
        required
      ></nys-textinput>
    </form>
    <div style="display:flex; flex-direction: column; gap:10px; margin:20px 0;">
      <nys-textinput
        form=${args.id}
        name="lname"
        placeholder="I'm outside the form!"
        label="Last name:"
        description="Enter your legal last name"
        id="lname"
        type="text"
        required
      ></nys-textinput>
      <nys-button
        form=${args.id}
        size="sm"
        label="Submit"
        type="submit"
      ></nys-button>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<form id="user-info-form">
  <nys-textinput
    name="fname"
    placeholder="I'm inside the form!"
    label="First name:"
    description="Enter your legal first name"
    id="fname"
    type="text"
    required
  ></nys-textinput>
</form>
<div style="display:flex; gap:10px; margin:20px 0;">
  <nys-textinput
    form="user-info-form"
    name="lname"
    placeholder="I'm outside the form!"
    label="Last name:"
    description="Enter your legal last name"
    id="lname"
    type="text"
    required
  ></nys-textinput>
  <nys-button form="user-info-form" size="sm" label="Submit" type="submit"></nys-button>
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
  },
  render: (args) => html`
    <form
      .id=${args.id}
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <fieldset style="display: flex; flex-direction: column; gap: 10px; background-color: #f0f0f0; padding: 20px;">
        <legend>User Information</legend>
        <nys-radiogroup
          label="Select your agency"
          description="This is the agency, department, or office you work for."
          size="sm"
        >
          <nys-radiobutton
            name="agency"
            checked
            label="Department of Health"
            value="doh"
          ></nys-radiobutton>
          <nys-radiobutton
            name="agency"
            label="Office of Information Technology Services"
            value="its"
          ></nys-radiobutton>
          <nys-radiobutton
            name="agency"
            label="New York State Attorney General"
            value="ag"
          ></nys-radiobutton>
        </nys-radiogroup>

        <nys-select
          name="state"
          id="state-select"
          label="Select state"
          description="This is your primary work location state"
          width="full"
        >
          <nys-option value="nj" label="New Jersey"></nys-option>
          <nys-option value="ny" label="New York"></nys-option>
          <nys-option value="pa" label="Pennsylvania"></nys-option>
          <nys-option value="ma" label="Massachusetts">/nys-option>
          <nys-option value="vt" label="Vermont"></nys-option>
          <nys-option value="ct" label="Connecticut"></nys-option>
        </nys-select>
        <nys-checkboxgroup
          label="Select your favorite New York landmarks"
          description="Choose from the options below"
        >
          <nys-checkbox
            label="Adirondacks"
            name="landmarks"
            value="adirondacks"
            errorMessage="You must select all that applies"
            checked
          ></nys-checkbox>
          <nys-checkbox label="Finger Lakes" name="landmarks" value="finger-lakes" checked></nys-checkbox>
          <nys-checkbox label="Catskills" name="landmarks" value="catskills"></nys-checkbox>
          <nys-checkbox label="Niagara Falls" name="landmarks" value="niagara-falls" ></nys-checkbox>
          <nys-checkbox label="Coney Island" name="landmarks" value="coney-island"></nys-checkbox>
        </nys-checkboxgroup>
        <nys-button size="sm" label="Submit" type="submit"></nys-button>
      </fieldset>
    </form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<form id="work-location">
  <fieldset>
    <legend>User Information</legend>
    <nys-radiogroup
      label="Select your agency"
      description="This is the agency, department, or office you work for."
      size="sm"
    >
      <nys-radiobutton
        name="agency"
        checked
        label="Department of Health"
        value="doh"
      ></nys-radiobutton>
      <nys-radiobutton
        name="agency"
        label="Office of Information Technology Services"
        value="its"
      ></nys-radiobutton>
      <nys-radiobutton
        name="agency"
        label="New York State Attorney General"
        value="ag"
      ></nys-radiobutton>
    </nys-radiogroup>

    <nys-select
      name="state"
      id="state-select"
      label="Select state"
      description="This is your primary work location state"
      width="full"
    >
      <nys-option value="nj" label="New Jersey"></nys-option>
      <nys-option value="ny" label="New York"></nys-option>
      <nys-option value="pa" label="Pennsylvania"></nys-option>
      <nys-option value="ma" label="Massachusetts">/nys-option>
      <nys-option value="vt" label="Vermont"></nys-option>
      <nys-option value="ct" label="Connecticut"></nys-option>
    </nys-select>
    <nys-checkboxgroup
      label="Select your favorite New York landmarks"
      description="Choose from the options below"
    >
      <nys-checkbox
        label="Adirondacks"
        name="landmarks"
        value="adirondacks"
        errorMessage="You must select all that applies"
        checked
      ></nys-checkbox>
      <nys-checkbox label="Finger Lakes" checked></nys-checkbox>
      <nys-checkbox label="Catskills" checked></nys-checkbox>
      <nys-checkbox label="Niagara Falls" checked></nys-checkbox>
      <nys-checkbox label="Coney Island"></nys-checkbox>
    </nys-checkboxgroup>
    <nys-button size="sm" label="Submit" type="submit"></nys-button>
  </fieldset>
</form>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: TEST
export const TEST: Story = {
  args: {
    id: "work-location",
  },
  render: (args) => html`
    <form
      .id=${args.id}
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        console.log(
          "You should not be seeing this message if validation fails.",
        );
        const formData = new FormData(e.target as HTMLFormElement);
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <fieldset
        style="display: flex; flex-direction: column; gap: 10px; background-color: #f0f0f0; padding: 20px;"
      >
        <legend>User Information</legend>

        <nys-checkbox label="YOLO" name="yolo" value="YOLO"></nys-checkbox>
        <nys-checkbox label="yolo2" name="yolo" value="yolo2"></nys-checkbox>
        <nys-checkbox label="Wow" name="wow" value="wow"></nys-checkbox>
        <hr style="background-color: black; width: 100%; height: 2px;" />

        <nys-checkboxgroup
          label="Select your favorite New York landmarks"
          description="Choose from the options below"
        >
          <nys-checkbox
            label="Broccoli"
            name="food"
            value="Broccoli"
          ></nys-checkbox>
          <nys-checkbox
            label="celery"
            name="food"
            value="celery"
          ></nys-checkbox>
          <nys-checkbox
            label="Veggies"
            name="food"
            value="Veggies"
          ></nys-checkbox>
        </nys-checkboxgroup>

        <nys-button size="sm" label="Submit" type="submit"></nys-button>
      </fieldset>
    </form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
`.trim(),
        type: "auto",
      },
    },
  },
};
