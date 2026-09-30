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
    <>
      <h1>Forms: controlled</h1>
      <p>
        The shared application form with controlled <code>useState</code>{" "}
        bindings and native form validation.
      </p>

      <div className="nys-grid-row">
        <section className="nys-grid-col-12 nys-desktop:nys-grid-col-8">
          <h2>Application form</h2>
          <form
            ref={formRef}
            className="nys-display-flex nys-flex-column nys-flex-gap-300"
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

            <div className="nys-display-flex nys-flex-wrap nys-flex-align-center nys-flex-gap-200 nys-margin-t-200">
              <NysButton type="submit" label="Submit" data-testid="submit" />
              <button
                type="button"
                className="app-action"
                data-testid="reset"
                onClick={reset}
              >
                Reset
              </button>
              <button
                type="button"
                className="app-action"
                data-testid="toggle-disabled"
                onClick={() => setFirstNameDisabled((d) => !d)}
              >
                Toggle first name disabled
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="nys-grid-row nys-grid-gap-400">
        <section className="nys-grid-col-12 nys-tablet:nys-grid-col-6">
          <h2>Live model</h2>
          <pre className="app-readout" data-testid="model">{JSON.stringify(model, null, 2)}</pre>
        </section>
        <section className="nys-grid-col-12 nys-tablet:nys-grid-col-6">
          <h2>Submitted</h2>
          <pre className="app-readout" data-testid="submitted">
            {submitted ? JSON.stringify(submitted, null, 2) : ""}
          </pre>
        </section>
      </div>
    </>
  );
}
