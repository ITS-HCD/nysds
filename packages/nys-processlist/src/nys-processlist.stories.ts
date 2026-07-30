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
    strong: false,
    neutral: false,
    size: "md",
    initialStep: 1,
    label: "Gather your documents",
    description: "",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["md", "sm"] },
  },
  render: (args) => {
    return html`
      <nys-processlist
        id="application-steps"
        ?strong=${args.strong}
        ?neutral=${args.neutral}
        size=${args.size}
        initialStep=${args.initialStep}
      >
        <nys-processlistitem
          label=${args.label}
          description=${args.description}
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps">
  <nys-processlistitem label="Gather your documents"></nys-processlistitem>
  <nys-processlistitem label="Complete the application"></nys-processlistitem>
  <nys-processlistitem label="Submit and await review"></nys-processlistitem>
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
        <nys-processlistitem
          label="Gather your documents"
          description="Recent pay stubs and a current property tax bill."
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
          description="Most applicants finish in about 20 minutes."
        ></nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps2">
  <nys-processlistitem
    label="Gather your documents"
    description="Recent pay stubs and a current property tax bill."
  ></nys-processlistitem>
  <nys-processlistitem
    label="Complete the application"
    description="Most applicants finish in about 20 minutes."
  ></nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const DescriptionSlot: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps-desc-slot">
        <nys-processlistitem label="Gather your documents">
          <div slot="description">
            Recent pay stubs and a
            <strong>current</strong>
            property tax bill.
          </div>
        </nys-processlistitem>
        <nys-processlistitem label="Complete the application">
          <div slot="description">
            Most applicants finish in about
            <a href="https://www.ny.gov">20 minutes</a>
            .
          </div>
        </nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps-desc-slot">
  <nys-processlistitem label="Gather your documents">
    <div slot="description">
      Recent pay stubs and a
      <strong>current</strong>
      property tax bill.
    </div>
  </nys-processlistitem>
  <nys-processlistitem label="Complete the application">
    <div slot="description">
      Most applicants finish in about
      <a href="https://www.ny.gov">20 minutes</a>
      .
    </div>
  </nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps-sm" size="sm">
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps-sm" size="sm">
  <nys-processlistitem label="Gather your documents"></nys-processlistitem>
  <nys-processlistitem label="Complete the application"></nys-processlistitem>
  <nys-processlistitem label="Submit and await review"></nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const Strong: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps-strong" strong>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps-strong" strong>
  <nys-processlistitem label="Gather your documents"></nys-processlistitem>
  <nys-processlistitem label="Complete the application"></nys-processlistitem>
  <nys-processlistitem label="Submit and await review"></nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const Neutral: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps-neutral" neutral>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps-neutral" neutral>
  <nys-processlistitem label="Gather your documents"></nys-processlistitem>
  <nys-processlistitem label="Complete the application"></nys-processlistitem>
  <nys-processlistitem label="Submit and await review"></nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const StrongNeutral: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps-strong-neutral" strong neutral>
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps-strong-neutral" strong neutral>
  <nys-processlistitem label="Gather your documents"></nys-processlistitem>
  <nys-processlistitem label="Complete the application"></nys-processlistitem>
  <nys-processlistitem label="Submit and await review"></nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};

export const InitialStep: Story = {
  render: () => {
    return html`
      <nys-processlist id="application-steps-part1">
        <nys-processlistitem
          label="Gather your documents"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Complete the application"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Submit and await review"
        ></nys-processlistitem>
      </nys-processlist>

      <p>
        OK, intermission time. Get up, stretch, and drink the glass of lemonade.
      </p>

      <nys-processlist id="application-steps-part2" initialstep="4">
        <nys-processlistitem label="Okay let's continue"></nys-processlistitem>
        <nys-processlistitem
          label="Wow, this might be tricky"
        ></nys-processlistitem>
        <nys-processlistitem
          label="Cool cool, I got this thing"
        ></nys-processlistitem>
      </nys-processlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-processlist id="application-steps-part1">
  <nys-processlistitem label="Gather your documents"></nys-processlistitem>
  <nys-processlistitem label="Complete the application"></nys-processlistitem>
  <nys-processlistitem label="Submit and await review"></nys-processlistitem>
</nys-processlist>

<p>OK, intermission time. Get up, stretch, and drink the glass of lemonade.</p>

<nys-processlist id="application-steps-part2" initialstep="4">
  <nys-processlistitem label="Okay let's continue"></nys-processlistitem>
  <nys-processlistitem label="Wow, this might be tricky"></nys-processlistitem>
  <nys-processlistitem label="Cool cool, I got this thing"></nys-processlistitem>
</nys-processlist>`,
        type: "auto",
      },
    },
  },
};
