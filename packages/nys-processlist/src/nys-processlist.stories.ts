import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-processlist";
import "./nys-processlistitem";

const meta: Meta = {
  title: "Components/Processlist",
  component: "nys-processlist",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    start: 1,
    step: 1,
  },
  render: (args) => {
    return html`
      <nys-processlist id="application-steps" start=${args.start}>
        <nys-processlistitem step=${args.step}
          >Gather your documents</nys-processlistitem
        >
        <nys-processlistitem>Complete the application</nys-processlistitem>
        <nys-processlistitem>Submit and await review</nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps">
  <nys-processlistitem>Gather your documents</nys-processlistitem>
  <nys-processlistitem>Complete the application</nys-processlistitem>
  <nys-processlistitem>Submit and await review</nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const Description: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps2">
        <nys-processlistitem>
          Gather your documents
          <span slot="description"
            >Recent pay stubs and a current property tax bill.</span
          >
        </nys-processlistitem>
        <nys-processlistitem>
          Complete the application
          <span slot="description"
            >Most applicants finish in about 20 minutes.</span
          >
        </nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps2">
  <nys-processlistitem>
    Gather your documents
    <span slot="description">Recent pay stubs and a current property tax bill.</span>
  </nys-processlistitem>
  <nys-processlistitem>
    Complete the application
    <span slot="description">Most applicants finish in about 20 minutes.</span>
  </nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const CustomStart: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps3" start="3">
        <nys-processlistitem>Submit and await review</nys-processlistitem>
        <nys-processlistitem>Receive your determination</nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps3" start="3">
  <nys-processlistitem>Submit and await review</nys-processlistitem>
  <nys-processlistitem>Receive your determination</nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};
