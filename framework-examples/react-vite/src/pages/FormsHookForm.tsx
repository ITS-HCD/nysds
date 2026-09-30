import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
  useNysField,
} from "@nysds/react";
import { countyOptions, stateOptions } from "../forms-model";

/** RHF model: `resume` holds the raw files; the readouts serialize the name. */
interface HookFormModel {
  firstName: string;
  bio: string;
  state: string;
  county: string;
  dob: string;
  agree: boolean;
  languages: string[];
  contact: string;
  newsletter: boolean;
  resume: File[];
}

const defaults: HookFormModel = {
  firstName: "",
  bio: "",
  state: "",
  county: "",
  dob: "",
  agree: false,
  languages: [],
  contact: "",
  newsletter: false,
  resume: [],
};

/** Serializable view of the model for the readouts the tests parse. */
function toReadout(values: HookFormModel) {
  return { ...values, resume: values.resume[0]?.name ?? "" };
}

/**
 * The application form implemented with React Hook Form. Validation is
 * framework-owned: `rules` on the controller, surfaced through the
 * component's own `showError` and `errorMessage` props.
 */
export function FormsHookForm() {
  const { control, handleSubmit, reset, formState } = useForm<HookFormModel>({
    defaultValues: defaults,
  });
  const { errors } = formState;
  const values = useWatch({ control }) as HookFormModel;
  const [submitted, setSubmitted] = React.useState<HookFormModel | null>(null);
  const [firstNameDisabled, setFirstNameDisabled] = React.useState(false);

  const onValid = (data: HookFormModel) => setSubmitted(data);

  return (
    <>
      <h1>Forms: React Hook Form</h1>
      <p>
        The shared application form with React Hook Form. The framework owns
        validation, surfaced through <code>showError</code> and{" "}
        <code>errorMessage</code>.
      </p>

      <div className="nys-grid-row">
        <section className="nys-grid-col-12 nys-desktop:nys-grid-col-8">
          <h2>Application form</h2>
          <form
            className="nys-display-flex nys-flex-column nys-flex-gap-300"
            onSubmit={handleSubmit(onValid)}
          >
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "Enter your first name" }}
              render={({ field }) => (
                <NysTextinput
                  label="First name"
                  name="firstName" data-field="firstName"
                  disabled={firstNameDisabled}
                  showError={!!errors.firstName}
                  errorMessage={errors.firstName?.message ?? ""}
                  {...useNysField(field)}
                />
              )}
            />
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <NysTextarea label="Bio" name="bio" data-field="bio" {...useNysField(field)} />
              )}
            />
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <NysSelect label="State" name="state" data-field="state" {...useNysField(field)}>
                  {stateOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </NysSelect>
              )}
            />
            <Controller
              name="county"
              control={control}
              render={({ field }) => (
                <NysCombobox label="County" name="county" data-field="county" {...useNysField(field)}>
                  {countyOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </NysCombobox>
              )}
            />
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <NysDatepicker
                  label="Date of birth"
                  name="dob" data-field="dob"
                  {...useNysField(field)}
                />
              )}
            />
            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <NysCheckbox
                  label="I agree to the terms"
                  name="agree" data-field="agree"
                  value="yes"
                  {...useNysField(field, "checked")}
                />
              )}
            />
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <NysCheckboxgroup
                  label="Languages"
                  name="languages"
                  {...useNysField<string[]>(field)}
                >
                  <NysCheckbox label="English" value="en" />
                  <NysCheckbox label="Spanish" value="es" />
                </NysCheckboxgroup>
              )}
            />
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <NysRadiogroup
                  label="Preferred contact method"
                  name="contact"
                  {...useNysField(field)}
                >
                  <NysRadiobutton label="Email" name="contact" value="email" />
                  <NysRadiobutton label="Phone" name="contact" value="phone" />
                </NysRadiogroup>
              )}
            />
            <Controller
              name="newsletter"
              control={control}
              render={({ field }) => (
                <NysToggle
                  label="Subscribe to the newsletter"
                  name="newsletter" data-field="newsletter"
                  {...useNysField(field, "checked")}
                />
              )}
            />
            <Controller
              name="resume"
              control={control}
              render={({ field }) => (
                <NysFileinput
                  label="Resume"
                  name="resume" data-field="resume"
                  {...useNysField(field, "files")}
                />
              )}
            />

            <div className="nys-display-flex nys-flex-wrap nys-flex-align-center nys-flex-gap-200 nys-margin-t-200">
              <NysButton type="submit" label="Submit" data-testid="submit" />
              <button
                type="button"
                className="app-action"
                data-testid="reset"
                onClick={() => {
                  reset(defaults);
                  setSubmitted(null);
                }}
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
          <pre className="app-readout" data-testid="model">
            {JSON.stringify(toReadout({ ...defaults, ...values }), null, 2)}
          </pre>
        </section>
        <section className="nys-grid-col-12 nys-tablet:nys-grid-col-6">
          <h2>Submitted</h2>
          <pre className="app-readout" data-testid="submitted">
            {submitted ? JSON.stringify(toReadout(submitted), null, 2) : ""}
          </pre>
        </section>
      </div>
    </>
  );
}
