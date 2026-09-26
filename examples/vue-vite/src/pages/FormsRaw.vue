<script setup lang="ts">
import { reactive, ref } from "vue";
// Importing the package registers every element and adds the `<nys-*>`
// types; the raw tags below are not wrapper components.
import "@nysds/vue";
import {
  countyOptions,
  initialModel,
  stateOptions,
  type FormsModel,
} from "../forms-model";

/**
 * The same form written with the raw custom elements, no wrapper
 * components: `:value` / `:checked` bind properties and `@nys-*` listeners
 * write the model back. Vue's own `v-model` doesn't apply here — it listens
 * for native `input` events instead of the `nys-*` events NYSDS defines.
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
  <h1>Forms: raw tags</h1>
  <p>
    The shared application form with plain <code>&lt;nys-*&gt;</code> tags,
    property bindings, and <code>@nys-*</code> listeners.
  </p>

  <div class="nys-grid-row">
    <section class="nys-grid-col-12 nys-desktop:nys-grid-col-8">
      <h2>Application form</h2>
      <form
        ref="form"
        class="nys-display-flex nys-flex-column nys-flex-gap-300"
        @submit.prevent="onSubmit"
      >
        <nys-textinput
          label="First name"
          name="firstName"
          data-field="firstName"
          :required="true"
          :value="model.firstName"
          :disabled="firstNameDisabled"
          @nys-input="(e) => (model.firstName = e.detail.value)"
        />
        <nys-textarea
          label="Bio"
          name="bio"
          data-field="bio"
          :value="model.bio"
          @nys-input="(e) => (model.bio = e.detail.value)"
        />
        <nys-select
          label="State"
          name="state"
          data-field="state"
          :value="model.state"
          @nys-change="(e) => (model.state = e.detail.value)"
        >
          <option v-for="o in stateOptions" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </nys-select>
        <nys-combobox
          label="County"
          name="county"
          data-field="county"
          :value="model.county"
          @nys-change="(e) => (model.county = e.detail.value)"
        >
          <option v-for="o in countyOptions" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </nys-combobox>
        <nys-datepicker
          label="Date of birth"
          name="dob"
          data-field="dob"
          :value="model.dob"
          @nys-change="(e) => (model.dob = e.detail.value)"
        />
        <nys-checkbox
          label="I agree to the terms"
          name="agree"
          data-field="agree"
          value="yes"
          :checked="model.agree"
          @nys-change="(e) => (model.agree = e.detail.checked)"
        />
        <nys-checkboxgroup
          label="Languages"
          name="languages"
          :value="model.languages"
          @nys-change="(e) => (model.languages = e.detail.value)"
        >
          <nys-checkbox label="English" value="en" />
          <nys-checkbox label="Spanish" value="es" />
        </nys-checkboxgroup>
        <nys-radiogroup
          label="Preferred contact method"
          name="contact"
          :value="model.contact"
          @nys-change="(e) => (model.contact = e.detail.value)"
        >
          <nys-radiobutton label="Email" name="contact" value="email" />
          <nys-radiobutton label="Phone" name="contact" value="phone" />
        </nys-radiogroup>
        <nys-toggle
          label="Subscribe to the newsletter"
          name="newsletter"
          data-field="newsletter"
          :checked="model.newsletter"
          @nys-change="(e) => (model.newsletter = e.detail.checked)"
        />
        <nys-fileinput
          label="Resume"
          name="resume"
          data-field="resume"
          @nys-change="(e) => (model.resume = e.detail.files[0]?.name ?? '')"
        />

        <div class="nys-display-flex nys-flex-wrap nys-flex-align-center nys-flex-gap-200 nys-margin-t-200">
          <nys-button type="submit" label="Submit" data-testid="submit" />
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
