import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "@nys-excelsior/nys-checkbox";
import "@nys-excelsior/nys-radiobutton";
import "@nys-excelsior/nys-select";
import "@nys-excelsior/nys-textarea";
import "@nys-excelsior/nys-textinput";
import "@nys-excelsior/nys-toggle";

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
 * Demonstrates how developers might handle the `nys-submit` event bubbled up from <nys-form>.
 * Converts FormData into a key-value object for easier manipulation,
 * logs the processed and raw data, and displays it in an alert.
 */
const useData = (formData: FormData) => {
  const formValues: Record<string, string> = {};
  formData.forEach((value, key) => {
    formValues[key] = value.toString();
  });

  alert(JSON.stringify(formValues, null, 2));
};

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Native Form with Custom Web Components
export const nativeFormWithComponents: Story = {
  args: {
    id: "nys-work-form",
  },

  render: (args) => html`
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

        console.log("You should not be seeing this message if validation is suppose to fail. Otherwise, success!")
        const formData = new FormData(e.target as HTMLFormElement);
        // Convert FormData to a simple object for easier logging
        const formDataObj: Record<string, any> = {};
        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });
        alert('Form Data:\n' + JSON.stringify(formDataObj, null, 2));
      }}
    >
      <label for="fullname">Enter full name: </label>
      <input id="fullname" type="text" name="fullname" placeholder="Did you know I'm a native HTML element?"/>

      <label for="password-native">Password (Native): </label>
      <input id="password-native" type="password" autocomplete="on" name="password-native" placeholder="Testing: Can you break into my password? (native)"/>

      <nys-textinput
        name="password-nys"
        placeholder="Can you break into my password? (nys-component)"
        label="Password (nys-component):"
        description="Hack me"
        id="password-nys"
        type="password"
        required
      ></nys-textinput>

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
        required
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
      >
      </nys-textarea>
      <nys-toggle
        label="Dark Mode"
        name="dark-mode"
        value="dark"
      ></nys-toggle>
      <button type="submit">Send</button>
    </form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<form id="nys-work-form">
  <label for="fullname">Enter full name: </label>
  <input id="fullname" type="text" name="fullname" placeholder="Did you know I'm a native HTML element?"/>

  <label for="password-native">Password (Native): </label>
  <input id="password-native" type="password" autocomplete="on" name="password-native" placeholder="Testing: Can you break into my password? (native)"/>

  <nys-textinput
    name="password-nys"
    placeholder="Can you break into my password? (nys-component)"
    label="Password (nys-component):"
    description="Hack me"
    id="password-nys"
    type="password"
  ></nys-textinput>

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
  >
  </nys-textarea>
  <nys-toggle
    label="Dark Mode"
    name="dark-mode"
    value="dark"
  ></nys-toggle>
  <button type="submit">Send</button>
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
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @submit=${(e: SubmitEvent) => {
        console.log("Form submitted...you should not see this message if validation fails.");
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <input placeholder="yo" name="test" required></input>
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
      <button type="submit">Send</button>
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
  <button type="submit">Send</button>
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
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
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
    <div style="display:flex; gap:10px; margin:20px 0;">
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
      <button form=${args.id} type="submit">Send</button>
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
  <button form="user-info-form" type="submit">Send</button>
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
    <form
      .id=${args.id}
      ?fieldset=${args.fieldset}
      legend=${args.legend}
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        useData(formData); // process FormData with the useData function (see above where it says "CUSTOM FUNCTION")
      }}
    >
      <fieldset>
        <legend>Select a Location:</legend>
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
        <nys-select
          name="state"
          id="state-select"
          label="Select state"
          description="This is your primary work location state"
          size="sm"
        >
          <option value="">--Please choose an option--</option>
          <option value="nj">New Jersey</option>
          <option value="ny">New York</option>
          <option value="pa">Pennsylvania</option>
          <option value="ma">Massachusetts</option>
          <option value="vt">Vermont</option>
          <option value="ct">Connecticut</option>
        </nys-select>
        <button type="submit">Send</button>
      </fieldset>
    </form>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<form id="work-location">
  <fieldset>
    <legend>Select a Location:</legend>
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
    <nys-select
      name="state"
      id="state-select"
      label="Select state"
      description="This is your primary work location state"
      size="sm"
    >
      <option value="">--Please choose an option--</option>
      <option value="nj">New Jersey</option>
      <option value="ny">New York</option>
      <option value="pa">Pennsylvania</option>
      <option value="ma">Massachusetts</option>
      <option value="vt">Vermont</option>
      <option value="ct">Connecticut</option>
    </nys-select>
    <button type="submit">Send</button>
  </fieldset>
</form>
`.trim(),
        type: "auto",
      },
    },
  },
};