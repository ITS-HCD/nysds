import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-onthispage";
import "@nysds/nys-globalfooter";
import "@nysds/nys-globalheader";
import "@nysds/nys-unavfooter";
import "@nysds/nys-unavheader";

const meta: Meta = {
  title: "Components/Onthispage",
  component: "nys-onthispage",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          '`<nys-onthispage>` is an in-page navigation component.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>\n  <NysOnthispage style={{ flex: "0 0 220px" }} />\n  <main style={{ flex: "1", minWidth: "0" }}>\n    <h1>Apply for a permit</h1>\n    <p>Use this guide to find out if you qualify and how to apply.</p>\n    <h2>Eligibility</h2>\n    <p>You must be a New York State resident aged 18 or older.</p>\n    <p>Additional eligibility requirements may apply.</p>\n    <p>Review the requirements before submitting your application.</p>\n    <h2>How to apply</h2>\n    <p>\n      Complete the online form and upload your supporting documents.\n    </p>\n    <p>Make sure all information is accurate before submitting.</p>\n    <p>Keep a copy of your application for your records.</p>\n    <h2>Required documents</h2>\n    <p>\n      Bring a valid proof of identity, proof of address, and any other supporting documentation.\n    </p>\n    <p>Additional documents may be requested during review.</p>\n    <p>Ensure your documents are current and legible.</p>\n    <h2>What happens next</h2>\n    <p>We review applications within 10 business days.</p>\n    <p>You may be contacted if additional information is needed.</p>\n    <p>\n      You will receive a notification when a decision has been made.\n    </p>\n  </main>\n</div>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<div style="display: flex; gap: 2rem; align-items: flex-start">\n  <nys-onthispage style="flex: 0 0 220px"></nys-onthispage>\n  <main style="flex: 1; min-width: 0">\n    <h1>Apply for a permit</h1>\n    <p>Use this guide to find out if you qualify and how to apply.</p>\n    <h2>Eligibility</h2>\n    <p>You must be a New York State resident aged 18 or older.</p>\n    <p>Additional eligibility requirements may apply.</p>\n    <p>Review the requirements before submitting your application.</p>\n    <h2>How to apply</h2>\n    <p>\n      Complete the online form and upload your supporting documents.\n    </p>\n    <p>Make sure all information is accurate before submitting.</p>\n    <p>Keep a copy of your application for your records.</p>\n    <h2>Required documents</h2>\n    <p>\n      Bring a valid proof of identity, proof of address, and any other supporting documentation.\n    </p>\n    <p>Additional documents may be requested during review.</p>\n    <p>Ensure your documents are current and legible.</p>\n    <h2>What happens next</h2>\n    <p>We review applications within 10 business days.</p>\n    <p>You may be contacted if additional information is needed.</p>\n    <p>\n      You will receive a notification when a decision has been made.\n    </p>\n  </main>\n</div>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    heading: "On this page",
    scope: "main",
    sticky: false,
    offset: 80,
    smoothScroll: true,
  },
  render: (args) => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start">
        <nys-onthispage
          style="flex: 0 0 220px"
          heading=${args.heading}
          scope=${args.scope}
          ?sticky=${args.sticky}
          offset=${args.offset}
          ?smoothScroll=${args.smoothScroll}
        ></nys-onthispage>

        <main style="flex: 1; min-width: 0">
          <h1>Apply for a permit</h1>
          <p>Use this guide to find out if you qualify and how to apply.</p>

          <h2>Eligibility</h2>
          <p>You must be a New York State resident aged 18 or older.</p>
          <p>Additional eligibility requirements may apply.</p>
          <p>Review the requirements before submitting your application.</p>

          <h2>How to apply</h2>
          <p>Complete the online form and upload your supporting documents.</p>
          <p>Make sure all information is accurate before submitting.</p>
          <p>Keep a copy of your application for your records.</p>

          <h2>Required documents</h2>
          <p>
            Bring a valid proof of identity, proof of address, and any other
            supporting documentation.
          </p>
          <p>Additional documents may be requested during review.</p>
          <p>Ensure your documents are current and legible.</p>

          <h2>What happens next</h2>
          <p>We review applications within 10 business days.</p>
          <p>You may be contacted if additional information is needed.</p>
          <p>You will receive a notification when a decision has been made.</p>
        </main>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start">
  <nys-onthispage style="flex: 0 0 220px"></nys-onthispage>

  <main style="flex: 1; min-width: 0">
    <h1>Apply for a permit</h1>
    <p>Use this guide to find out if you qualify and how to apply.</p>

    <h2>Eligibility</h2>
    <p>You must be a New York State resident aged 18 or older.</p>
    <p>Additional eligibility requirements may apply.</p>
    <p>Review the requirements before submitting your application.</p>

    <h2>How to apply</h2>
    <p>Complete the online form and upload your supporting documents.</p>
    <p>Make sure all information is accurate before submitting.</p>
    <p>Keep a copy of your application for your records.</p>

    <h2>Required documents</h2>
    <p>
      Bring a valid proof of identity, proof of address, and any other supporting documentation.
    </p>
    <p>Additional documents may be requested during review.</p>
    <p>Ensure your documents are current and legible.</p>

    <h2>What happens next</h2>
    <p>We review applications within 10 business days.</p>
    <p>You may be contacted if additional information is needed.</p>
    <p>You will receive a notification when a decision has been made.</p>
  </main>
</div>`,
        type: "auto",
      },
    },
  },
};

export const Sticky: Story = {
  render: () => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start">
        <nys-onthispage sticky offset="24"></nys-onthispage>

        <main style="flex: 1; min-width: 0">
          <h1>Apply for a permit</h1>
          <p>Use this guide to find out if you qualify and how to apply.</p>

          <h2>Eligibility</h2>
          <p>You must be a New York State resident aged 18 or older.</p>
          <p style="min-height: 60vh">
            Review the requirements before submitting your application.
          </p>

          <h2>How to apply</h2>
          <p>Complete the online form and upload your supporting documents.</p>
          <p style="min-height: 60vh">
            Keep a copy of your application for your records.
          </p>

          <h2>Required documents</h2>
          <p>
            Bring a valid proof of identity, proof of address, and any other
            supporting documentation.
          </p>
          <p style="min-height: 60vh">
            Ensure your documents are current and legible.
          </p>

          <h2>What happens next</h2>
          <p>We review applications within 10 business days.</p>
          <p style="min-height: 60vh">
            You will receive a notification when a decision has been made.
          </p>
        </main>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start">
  <nys-onthispage sticky offset="24"></nys-onthispage>

  <main style="flex: 1; min-width: 0">
    <h1>Apply for a permit</h1>
    <p>Use this guide to find out if you qualify and how to apply.</p>

    <h2>Eligibility</h2>
    <p>You must be a New York State resident aged 18 or older.</p>
    <p style="min-height: 60vh">Review the requirements before submitting your application.</p>

    <h2>How to apply</h2>
    <p>Complete the online form and upload your supporting documents.</p>
    <p style="min-height: 60vh">Keep a copy of your application for your records.</p>

    <h2>Required documents</h2>
    <p>
      Bring a valid proof of identity, proof of address, and any other supporting documentation.
    </p>
    <p style="min-height: 60vh">Ensure your documents are current and legible.</p>

    <h2>What happens next</h2>
    <p>We review applications within 10 business days.</p>
    <p style="min-height: 60vh">You will receive a notification when a decision has been made.</p>
  </main>
</div>`,
        type: "auto",
      },
    },
  },
};

export const CustomHeading: Story = {
  render: () => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start">
        <nys-onthispage heading="In this guide"></nys-onthispage>

        <main style="flex: 1; min-width: 0">
          <h1>Apply for a permit</h1>

          <h2>Eligibility</h2>
          <p>You must be a New York State resident aged 18 or older.</p>

          <h2>How to apply</h2>
          <p>Complete the online form and upload your supporting documents.</p>

          <h2>What happens next</h2>
          <p>We review applications within 10 business days.</p>
        </main>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start">
  <nys-onthispage heading="In this guide"></nys-onthispage>

  <main style="flex: 1; min-width: 0">
    <h1>Apply for a permit</h1>

    <h2>Eligibility</h2>
    <p>You must be a New York State resident aged 18 or older.</p>

    <h2>How to apply</h2>
    <p>Complete the online form and upload your supporting documents.</p>

    <h2>What happens next</h2>
    <p>We review applications within 10 business days.</p>
  </main>
</div>`,
        type: "auto",
      },
    },
  },
};

export const TrackADifferentHeadingLevel: Story = {
  render: () => {
    return html`
      <nys-onthispage headingTracker="h3" scope="#guide"></nys-onthispage>

      <article id="guide">
        <h1>Part 1 (h1 tag)</h1>
        <h2>Part 2 (h2 tag)</h2>
        <h3>Eligibility (h3 tag)</h3>
        <h3>How to apply (h3 tag)</h3>
      </article>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-onthispage headingTracker="h3" scope="#guide"></nys-onthispage>

<article id="guide">
  <h1>Part 1 (h1 tag)</h1>
  <h2>Part 2 (h2 tag)</h2>
  <h3>Eligibility (h3 tag)</h3>
  <h3>How to apply (h3 tag)</h3>
</article>`,
        type: "auto",
      },
    },
  },
};

export const ExcludeAHeading: Story = {
  render: () => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start">
        <nys-onthispage></nys-onthispage>

        <main style="flex: 1; min-width: 0">
          <h1>Apply for a permit</h1>

          <h2>Eligibility</h2>
          <p>You must be a New York State resident aged 18 or older.</p>

          <h2>How to apply</h2>
          <p>Complete the online form and upload your supporting documents.</p>

          <h2 data-nys-onthispage-ignore>Related links</h2>
          <p>This heading does not appear in the list.</p>
        </main>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start">
  <nys-onthispage></nys-onthispage>

  <main style="flex: 1; min-width: 0">
    <h1>Apply for a permit</h1>

    <h2>Eligibility</h2>
    <p>You must be a New York State resident aged 18 or older.</p>

    <h2>How to apply</h2>
    <p>Complete the online form and upload your supporting documents.</p>

    <h2 data-nys-onthispage-ignore>Related links</h2>
    <p>This heading does not appear in the list.</p>
  </main>
</div>`,
        type: "auto",
      },
    },
  },
};

export const UseYourOwnHeadingIds: Story = {
  render: () => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start">
        <nys-onthispage style="flex: 0 0 220px"></nys-onthispage>

        <main style="flex: 1; min-width: 0">
          <h1>Apply for a permit</h1>

          <h2 id="eligibility">Eligibility</h2>
          <p>The link uses your id: #eligibility.</p>

          <h2>How to apply</h2>
          <p>No id set, so one is generated: #how-to-apply.</p>

          <h2>How to apply</h2>
          <p>Same text, so the generated id gets a suffix: #how-to-apply-2.</p>
        </main>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start">
  <nys-onthispage style="flex: 0 0 220px"></nys-onthispage>

  <main style="flex: 1; min-width: 0">
    <h1>Apply for a permit</h1>

    <h2 id="eligibility">Eligibility</h2>
    <p>The link uses your id: #eligibility.</p>

    <h2>How to apply</h2>
    <p>No id set, so one is generated: #how-to-apply.</p>

    <h2>How to apply</h2>
    <p>Same text, so the generated id gets a suffix: #how-to-apply-2.</p>
  </main>
</div>`,
        type: "auto",
      },
    },
  },
};

export const UpdateTheURLHash: Story = {
  render: () => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start">
        <nys-onthispage
          hashBehavior="replace"
          style="flex: 0 0 220px"
        ></nys-onthispage>

        <main style="flex: 1; min-width: 0">
          <h1>Apply for a permit</h1>

          <h2>Eligibility</h2>
          <p style="min-height: 80vh">You must be a New York State resident.</p>

          <h2>How to apply</h2>
          <p style="min-height: 80vh">Complete the online form.</p>

          <h2>What happens next</h2>
          <p style="min-height: 80vh">
            We review applications within 10 business days.
          </p>
        </main>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start">
  <nys-onthispage hashBehavior="replace" style="flex: 0 0 220px"></nys-onthispage>

  <main style="flex: 1; min-width: 0">
    <h1>Apply for a permit</h1>

    <h2>Eligibility</h2>
    <p style="min-height: 80vh">You must be a New York State resident.</p>

    <h2>How to apply</h2>
    <p style="min-height: 80vh">Complete the online form.</p>

    <h2>What happens next</h2>
    <p style="min-height: 80vh">We review applications within 10 business days.</p>
  </main>
</div>`,
        type: "auto",
      },
    },
  },
};

export const TurnOffSmoothScrolling: Story = {
  render: () => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start">
        <nys-onthispage
          smoothScroll="false"
          style="flex: 0 0 220px"
        ></nys-onthispage>

        <main style="flex: 1; min-width: 0">
          <h1>Apply for a permit</h1>

          <h2>Eligibility</h2>
          <p style="min-height: 80vh">You must be a New York State resident.</p>

          <h2>How to apply</h2>
          <p style="min-height: 80vh">Complete the online form.</p>

          <h2>What happens next</h2>
          <p style="min-height: 80vh">
            We review applications within 10 business days.
          </p>
        </main>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start">
  <nys-onthispage smoothScroll="false" style="flex: 0 0 220px"></nys-onthispage>

  <main style="flex: 1; min-width: 0">
    <h1>Apply for a permit</h1>

    <h2>Eligibility</h2>
    <p style="min-height: 80vh">You must be a New York State resident.</p>

    <h2>How to apply</h2>
    <p style="min-height: 80vh">Complete the online form.</p>

    <h2>What happens next</h2>
    <p style="min-height: 80vh">We review applications within 10 business days.</p>
  </main>
</div>`,
        type: "auto",
      },
    },
  },
};

export const PageLayout: Story = {
  render: () => {
    return html`
      <nys-unavheader></nys-unavheader>

      <nys-globalheader appName="NYS Design System" homepageLink="/">
        <ul>
          <li><a href="#">Item 1</a></li>
          <li><a href="#">Item 2</a></li>
          <li><a href="#">Item 3</a></li>
          <li><a href="#">Item 4</a></li>
          <li><a href="#">Item 5</a></li>
        </ul>
      </nys-globalheader>

      <div class="nys-grid-container">
        <div class="nys-grid-row nys-grid-gap">
          <main class="nys-desktop:nys-grid-col-9">
            <h1>Welcome to the Empire State of Mind</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit? Nope.
              Here, we say: grab a bagel, check the Erie Canal, and see what the
              Adirondacks are up to today.
            </p>

            <h2>Apple picking season</h2>
            <p style="min-height: 60vh">
              Orchards from the Hudson Valley to the Finger Lakes are open.
              Bring a basket, a sweater, and a strong opinion about cider
              donuts. Honeycrisp is the correct answer, but we will hear other
              opinions.
            </p>

            <h2>Pizza by the slice</h2>
            <p style="min-height: 60vh">
              Fold it. Do not eat it with a fork. A proper slice is hot, floppy,
              and cheaper than your parking meter. Every borough believes theirs
              is the best, and every borough is slightly right.
            </p>

            <h2>Road trip to Niagara Falls</h2>
            <p style="min-height: 60vh">
              Pack snacks and head west on the Thruway. Rest stops are
              plentiful, the falls are loud, and the mist is free. Bring a
              poncho if you plan to get close.
            </p>

            <h2>Snow day survival guide</h2>
            <p style="min-height: 60vh">
              Upstate gets a lot of snow, and Upstate is not impressed. Shovel
              early, check on your neighbors, and keep the hot chocolate within
              reach.
            </p>
          </main>

          <aside
            class="nys-desktop:nys-grid-col-3 nys-order-first nys-desktop:nys-order-last"
            style="margin-top: var(--nys-space-600)"
          >
            <nys-onthispage sticky offset="24"></nys-onthispage>
          </aside>
        </div>
      </div>

      <nys-globalfooter agencyName="NYS Design System" homepageLink="/">
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
        </ul>
      </nys-globalfooter>
      <nys-unavfooter></nys-unavfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader></nys-unavheader>

<nys-globalheader appName="NYS Design System" homepageLink="/">
  <ul>
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
    <li><a href="#">Item 4</a></li>
    <li><a href="#">Item 5</a></li>
  </ul>
</nys-globalheader>

<div class="nys-grid-container">
  <div class="nys-grid-row nys-grid-gap">
    <main class="nys-desktop:nys-grid-col-9">
      <h1>Welcome to the Empire State of Mind</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit? Nope. Here, we say: grab a bagel,
        check the Erie Canal, and see what the Adirondacks are up to today.
      </p>

      <h2>Apple picking season</h2>
      <p style="min-height: 60vh">
        Orchards from the Hudson Valley to the Finger Lakes are open. Bring a basket, a sweater, and
        a strong opinion about cider donuts. Honeycrisp is the correct answer, but we will hear
        other opinions.
      </p>

      <h2>Pizza by the slice</h2>
      <p style="min-height: 60vh">
        Fold it. Do not eat it with a fork. A proper slice is hot, floppy, and cheaper than your
        parking meter. Every borough believes theirs is the best, and every borough is slightly
        right.
      </p>

      <h2>Road trip to Niagara Falls</h2>
      <p style="min-height: 60vh">
        Pack snacks and head west on the Thruway. Rest stops are plentiful, the falls are loud, and
        the mist is free. Bring a poncho if you plan to get close.
      </p>

      <h2>Snow day survival guide</h2>
      <p style="min-height: 60vh">
        Upstate gets a lot of snow, and Upstate is not impressed. Shovel early, check on your
        neighbors, and keep the hot chocolate within reach.
      </p>
    </main>

    <aside
      class="nys-desktop:nys-grid-col-3 nys-order-first nys-desktop:nys-order-last"
      style="margin-top: var(--nys-space-600)"
    >
      <nys-onthispage sticky offset="24"></nys-onthispage>
    </aside>
  </div>
</div>

<nys-globalfooter agencyName="NYS Design System" homepageLink="/">
  <ul>
    <li><a href="#">Privacy Policy</a></li>
    <li><a href="#">Terms of Use</a></li>
  </ul>
</nys-globalfooter>
<nys-unavfooter></nys-unavfooter>`,
        type: "auto",
      },
    },
  },
};

export const ListenForLinkActivation: Story = {
  render: () => {
    return html`
      <div style="display: flex; gap: 2rem; align-items: flex-start;">
        <nys-onthispage id="toc" style="flex: 0 0 220px;"></nys-onthispage>

        <main style="flex: 1; min-width: 0;">
          <h1>Apply for a permit</h1>

          <h2>Eligibility</h2>
          <p>You must be a New York State resident aged 18 or older.</p>

          <h2>How to apply</h2>
          <p>Complete the online form and upload your supporting documents.</p>

          <h2>What happens next</h2>
          <p>We review applications within 10 business days.</p>
        </main>
      </div>

      <script>
        document.querySelector("#toc").addEventListener("nys-click", (e) => {
          const { id, label, index } = e.detail;
          console.log(\`Clicked "\${label}" (#\${id}, position \${index})\`);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div style="display: flex; gap: 2rem; align-items: flex-start;">
<nys-onthispage id="toc" style="flex: 0 0 220px;"></nys-onthispage>

<main style="flex: 1; min-width: 0;">
<h1>Apply for a permit</h1>

<h2>Eligibility</h2>
<p>You must be a New York State resident aged 18 or older.</p>

<h2>How to apply</h2>
<p>Complete the online form and upload your supporting documents.</p>

<h2>What happens next</h2>
<p>We review applications within 10 business days.</p>
</main>
</div>

<script>
document.querySelector("#toc").addEventListener("nys-click", (e) => {
const { id, label, index } = e.detail;
console.log(\`Clicked "\${label}" (#\${id}, position \${index})\`);
});
</script>`,
        type: "auto",
      },
    },
  },
};
