import * as React from "react";
import {
  NysButton,
  NysCheckbox,
  NysCheckboxgroup,
  NysCombobox,
  NysDatepicker,
  NysFileinput,
  NysRadiobutton,
  NysRadiogroup,
  NysSelect,
  NysTextarea,
  NysTextinput,
  NysToggle,
} from "@nysds/react";
import {
  countyOptions,
  initialModel,
  stateOptions,
  type FormsModel,
} from "../forms-model";

/**
 * The application form implemented with controlled `useState` bindings
 * and native form validation: firstName carries `required`, and
 * `nys-button type="submit"` submits through `form.requestSubmit()`, so
 * an invalid form blocks submission and the component shows its own
 * ElementInternals error.
 */
export function FormsControlled() {
  const [model, setModel] = React.useState<FormsModel>(initialModel);
  const [submitted, setSubmitted] = React.useState<FormsModel | null>(null);
  const [firstNameDisabled, setFirstNameDisabled] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const patch = (changes: Partial<FormsModel>) =>
    setModel((current) => ({ ...current, ...changes }));

  const reset = () => {
    setModel(initialModel);
    setSubmitted(null);
    // Clears the file input, which has no controlled value.
    formRef.current?.reset();
  };

  return (
    <main>
      <h1>Forms: controlled</h1>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(model);
        }}
      >
        <NysTextinput
          label="First name"
          name="firstName" data-field="firstName"
          required
          value={model.firstName}
          disabled={firstNameDisabled}
          onNysInput={(e) => patch({ firstName: e.detail.value })}
        />
        <NysTextarea
          label="Bio"
          name="bio" data-field="bio"
          value={model.bio}
          onNysInput={(e) => patch({ bio: e.detail.value })}
        />
        <NysSelect
          label="State"
          name="state" data-field="state"
          value={model.state}
          onNysChange={(e) => patch({ state: e.detail.value })}
        >
          {stateOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NysSelect>
        <NysCombobox
          label="County"
          name="county" data-field="county"
          value={model.county}
          onNysChange={(e) => patch({ county: e.detail.value })}
        >
          {countyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NysCombobox>
        <NysDatepicker
          label="Date of birth"
          name="dob" data-field="dob"
          value={model.dob}
          onNysChange={(e) => patch({ dob: e.detail.value })}
        />
        <NysCheckbox
          label="I agree to the terms"
          name="agree" data-field="agree"
          value="yes"
          checked={model.agree}
          onNysChange={(e) => patch({ agree: e.detail.checked })}
        />
        <NysCheckboxgroup
          label="Languages"
          name="languages"
          value={model.languages}
          onNysChange={(e) => patch({ languages: e.detail.value })}
        >
          <NysCheckbox label="English" value="en" />
          <NysCheckbox label="Spanish" value="es" />
        </NysCheckboxgroup>
        <NysRadiogroup
          label="Preferred contact method"
          name="contact"
          value={model.contact}
          onNysChange={(e) => patch({ contact: e.detail.value })}
        >
          <NysRadiobutton label="Email" name="contact" value="email" />
          <NysRadiobutton label="Phone" name="contact" value="phone" />
        </NysRadiogroup>
        <NysToggle
          label="Subscribe to the newsletter"
          name="newsletter" data-field="newsletter"
          checked={model.newsletter}
          onNysChange={(e) => patch({ newsletter: e.detail.checked })}
        />
        <NysFileinput
          label="Resume"
          name="resume" data-field="resume"
          onNysChange={(e) => patch({ resume: e.detail.files[0]?.name ?? "" })}
        />

        <NysButton type="submit" label="Submit" data-testid="submit" />
        <button type="button" data-testid="reset" onClick={reset}>
          Reset
        </button>
        <button
          type="button"
          data-testid="toggle-disabled"
          onClick={() => setFirstNameDisabled((d) => !d)}
        >
          Toggle first name disabled
        </button>
      </form>

      <h2>Live model</h2>
      <pre data-testid="model">{JSON.stringify(model, null, 2)}</pre>
      <h2>Submitted</h2>
      <pre data-testid="submitted">
        {submitted ? JSON.stringify(submitted, null, 2) : ""}
      </pre>
    </main>
  );
}
