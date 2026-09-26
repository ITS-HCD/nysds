<script setup lang="ts">
import { reactive, ref } from "vue";
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
} from "@nysds/vue";
import {
  countyOptions,
  initialModel,
  stateOptions,
  type FormsModel,
} from "../forms-model";

/**
 * The application form implemented with the `@nysds/vue` wrapper
 * components: `v-model` binds every control, and native form validation
 * does the rest. firstName carries `required`, and
 * `nys-button type="submit"` submits through `form.requestSubmit()`, so an
 * invalid form blocks submission and the component shows its own
 * ElementInternals error.
 */
const fresh = (): FormsModel => ({
  ...initialModel,
  languages: [...initialModel.languages],
});

const model = reactive<FormsModel>(fresh());
const submitted = ref<FormsModel | null>(null);
const firstNameDisabled = ref(false);
const form = ref<HTMLFormElement | null>(null);

const onSubmit = () => {
  submitted.value = { ...model, languages: [...model.languages] };
};

const reset = () => {
  Object.assign(model, fresh());
  submitted.value = null;
  // Clears the file input, which has no bound value.
  form.value?.reset();
};
</script>

<template>
  <h1>Forms: v-model</h1>
  <p>
    The shared application form with <code>v-model</code> on the
    <code>@nysds/vue</code> wrapper components and native form validation.
  </p>

  <div class="nys-grid-row">
    <section class="nys-grid-col-12 nys-desktop:nys-grid-col-8">
      <h2>Application form</h2>
      <form
        ref="form"
        class="nys-display-flex nys-flex-column nys-flex-gap-300"
        @submit.prevent="onSubmit"
      >
        <NysTextinput
          v-model="model.firstName"
          label="First name"
          name="firstName"
          data-field="firstName"
          required
          :disabled="firstNameDisabled"
        />
        <NysTextarea
          v-model="model.bio"
          label="Bio"
          name="bio"
          data-field="bio"
        />
        <NysSelect
          v-model="model.state"
          label="State"
          name="state"
          data-field="state"
        >
          <option v-for="o in stateOptions" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </NysSelect>
        <NysCombobox
          v-model="model.county"
          label="County"
          name="county"
          data-field="county"
        >
          <option v-for="o in countyOptions" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </NysCombobox>
        <NysDatepicker
          v-model="model.dob"
          label="Date of birth"
          name="dob"
          data-field="dob"
        />
        <NysCheckbox
          v-model="model.agree"
          label="I agree to the terms"
          name="agree"
          data-field="agree"
          value="yes"
        />
        <NysCheckboxgroup
          v-model="model.languages"
          label="Languages"
          name="languages"
        >
          <NysCheckbox label="English" value="en" />
          <NysCheckbox label="Spanish" value="es" />
        </NysCheckboxgroup>
        <NysRadiogroup
          v-model="model.contact"
          label="Preferred contact method"
          name="contact"
        >
          <NysRadiobutton label="Email" name="contact" value="email" />
          <NysRadiobutton label="Phone" name="contact" value="phone" />
        </NysRadiogroup>
        <NysToggle
          v-model="model.newsletter"
          label="Subscribe to the newsletter"
          name="newsletter"
          data-field="newsletter"
        />
        <NysFileinput
          label="Resume"
          name="resume"
          data-field="resume"
          @nys-change="(e) => (model.resume = e.detail.files[0]?.name ?? '')"
        />

        <div class="nys-display-flex nys-flex-wrap nys-flex-align-center nys-flex-gap-200 nys-margin-t-200">
          <NysButton type="submit" label="Submit" data-testid="submit" />
          <button
            type="button"
            class="app-action"
            data-testid="reset"
            @click="reset"
          >
            Reset
          </button>
          <button
            type="button"
            class="app-action"
            data-testid="toggle-disabled"
            @click="firstNameDisabled = !firstNameDisabled"
          >
            Toggle first name disabled
          </button>
        </div>
      </form>
    </section>
  </div>

  <div class="nys-grid-row nys-grid-gap-400">
    <section class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
      <h2>Live model</h2>
      <pre class="app-readout" data-testid="model">{{ JSON.stringify(model, null, 2) }}</pre>
    </section>
    <section class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
      <h2>Submitted</h2>
      <pre class="app-readout" data-testid="submitted">{{ submitted ? JSON.stringify(submitted, null, 2) : "" }}</pre>
    </section>
  </div>
</template>
