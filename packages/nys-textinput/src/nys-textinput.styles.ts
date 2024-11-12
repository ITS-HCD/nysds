import { css } from "lit";

export default css`
  .nys-textinput {
    font-family: Arial, sans-serif;
  }

  .nys-textinput__input {
    border-radius: 0.25rem;
    border: solid 1px gray;
    font-size: 16px;
    padding: 0.5rem;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }

  .xs {
    width: 4rem;
  }

  .sm {
    width: 8rem;
  }

  .md {
    width: 16rem;
  }

  .lg {
    width: 24rem;
  }

  .xl {
    width: 32rem;
  }

  /* Focused */
  .nys-textinput__input:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-textinput__input:disabled {
    background-color: #f0f0f0;
    border-color: #757575;
    cursor: not-allowed;
  }

  /* Required */
  .nys-textinput__input:required {
    border-color: red;
  }

  .nys-textinput__required {
    color: red;
    margin-left: 0.25rem;
  }

  .nys-textinput__requiredwrapper {
    display: flex;
  }

  .nys-textinput__text {
    display: flex;
    margin-bottom: 0.25rem;
  }

  /* Label styling */
  .nys-textinput__label {
    font-size: 16px;
    font-weight: 500;
    color: var(--form-label-color, #1b1b1b);
  }

  /* Help text styling */
  .nys-textinput__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
    font-style: italic;
  }

  /* Pattern validation styling */
  .nys-textinput__validation {
    padding-top: 0.5rem;
  }

  .nys-textinput__input:invalid + .nys-textinput__validation:after {
    color: red;
    content: " invalid";
    font-weight: bold;
  }

  .nys-textinput__input:valid + .nys-textinput__validation:after {
    color: green;
    content: " valid";
    font-weight: bold;
  }

  .nys-textinput__input:placeholder-shown + .nys-textinput__validation:after {
    color: black;
    content: " empty";
    font-weight: bold;
  }
`;
