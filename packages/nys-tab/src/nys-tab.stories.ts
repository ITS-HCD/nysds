import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";
import "./nys-tabgroup";
import "./nys-tabpanel";
import "@nysds/nys-accordion";

interface NysTabArgs {
  label: string;
  selected: boolean;
  disabled: boolean;
  orientation: "horizontal" | "vertical";
}

const meta: Meta<NysTabArgs> = {
  title: "Components/Tab",
  component: "nys-tab",
  argTypes: {
    label: { control: "text" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysTabArgs>;

export const Basic: Story = {
  args: {},
  render: () => html`
    <nys-tabgroup id="test">
      <nys-tab label="Tab One Long Name"></nys-tab>
      <nys-tab selected label="Tab Two Longer Name"></nys-tab>
      <nys-tab selected label="Tab Three Extra Long Name"></nys-tab>
      <nys-tab disabled label="Tab Four Disabled"></nys-tab>
      <nys-tabpanel>
        Content for Tab One.
        <nys-button label="test"></nys-button
      ></nys-tabpanel>
      <nys-tabpanel>
        <nys-accordion>
          <nys-accordionitem
            id="accordionId1"
            heading="How do I renew my passport or apply for a new one?"
          >
            <p>
              You can apply for or renew a U.S. passport through the U.S.
              Department of State. Some renewals can be done by mail.
            </p>
            <div style="display: flex; gap: 0.5rem; font-size: 1rem;">
              <a href="https://www.ny.gov" target="_blank"
                >Check your registration</a
              >
              <a href="https://www.ny.gov" target="_blank"
                >Fill out application</a
              >
            </div>
          </nys-accordionitem>
          <nys-accordionitem
            id="accordionId2"
            heading="How can I find out if I'm registered to vote?"
          >
            <p>
              You can check your registration status, update your information,
              or find out how to register through the National Association of
              Secretaries of State.
            </p>
          </nys-accordionitem>
        </nys-accordion>
      </nys-tabpanel>
      <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
      <nys-tabpanel>Content for Tab Four.</nys-tabpanel>
    </nys-tabgroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup>
  <nys-tab label="Tab One"></nys-tab>
  <nys-tabpanel>Content for Tab One.</nys-tabpanel>
  <nys-tab label="Tab Two"></nys-tab>
  <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
  <nys-tab label="Tab Three"></nys-tab>
  <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};
