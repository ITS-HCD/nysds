import { useState } from "react";
import {
  NysAccordion,
  NysAccordionItem,
  NysAlert,
  NysAvatar,
  NysBacktotop,
  NysBadge,
  NysBreadcrumbs,
  NysButton,
  NysCard,
  NysCheckbox,
  NysCheckboxgroup,
  NysCombobox,
  NysDatepicker,
  NysDivider,
  NysDropdownMenu,
  NysDropdownMenuItem,
  NysErrorMessage,
  NysFileinput,
  NysFileItem,
  NysGlobalFooter,
  NysGlobalHeader,
  NysIcon,
  NysIconlist,
  NysIconlistitem,
  NysLabel,
  NysModal,
  NysOption,
  NysPagination,
  NysProcesslist,
  NysProcesslistitem,
  NysRadiobutton,
  NysRadiogroup,
  NysSelect,
  NysSkipnav,
  NysStep,
  NysStepper,
  NysTab,
  NysTabgroup,
  NysTabpanel,
  NysTable,
  NysTextarea,
  NysTextinput,
  NysToggle,
  NysTooltip,
  NysUnavFooter,
  NysUnavHeader,
  NysVerticalnav,
  NysVerticalnavGroup,
  NysVideo,
} from "@nysds/react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="demo-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [county, setCounty] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [page, setPage] = useState(3);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = (message: string) =>
    setEventLog((entries) => [message, ...entries].slice(0, 5));

  return (
    <>
      <NysSkipnav href="#main-content" />
      <NysUnavHeader hideTranslate hideSearch />
      <NysGlobalHeader appName="Kitchen Sink" agencyName="NYS Design System" homepageLink="/" />

      <main id="main-content" className="demo-main">
        <h1>@nysds/react kitchen sink</h1>
        <p>
          Every NYSDS component, rendered through the generated React wrappers
          against the local <code>dist</code> builds.
        </p>

        <Section title="Accordion">
          <NysAccordion bordered singleSelect headingLevel="h3">
            <NysAccordionItem heading="What is NYSDS?" expanded>
              The New York State Design System — accessible web components for
              state digital products.
            </NysAccordionItem>
            <NysAccordionItem heading="Which frameworks are supported?">
              Plain HTML, React via @nysds/react, and Angular via @nysds/angular.
            </NysAccordionItem>
          </NysAccordion>
        </Section>

        <Section title="Alert">
          <div className="demo-stack">
            <NysAlert type="info" heading="Heads up" text="This demo runs against the local packages." />
            <NysAlert type="success" heading="Build complete" dismissible text="All packages compiled from source." />
          </div>
        </Section>

        <Section title="Avatar">
          <div className="demo-row">
            <NysAvatar ariaLabel="User avatar" initials="NY" color="#154973" />
            <NysAvatar ariaLabel="Icon avatar" icon="account_circle" />
          </div>
        </Section>

        <Section title="Badge">
          <div className="demo-row">
            <NysBadge label="Base" intent="base" />
            <NysBadge label="Success" intent="success" />
            <NysBadge label="Warning" intent="warning" />
            <NysBadge label="Error" intent="error" prefixIcon="error" />
          </div>
        </Section>

        <Section title="Breadcrumbs">
          <NysBreadcrumbs ariaLabel="Breadcrumb">
            <ol>
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/services/demo">Demo</a></li>
            </ol>
          </NysBreadcrumbs>
        </Section>

        <Section title="Button">
          <div className="demo-row">
            <NysButton label="Filled" onNysClick={() => log("nys-click: filled button")} />
            <NysButton label="Outline" variant="outline" />
            <NysButton label="Ghost" variant="ghost" />
            <NysButton label="Text" variant="text" />
            <NysButton label="Small" size="sm" />
            <NysButton label="With icon" prefixIcon="download" />
            <NysButton label="Disabled" disabled />
          </div>
        </Section>

        <Section title="Card">
          <div className="demo-row">
            <NysCard
              heading="Adirondack High Peaks"
              subheading="46 summits"
              description="Marcy, Algonquin, Haystack and 43 more over 4,000 feet."
            >
              <div slot="footer">
                <NysButton label="Plan a hike" variant="outline" size="sm" />
              </div>
            </NysCard>
          </div>
        </Section>

        <Section title="Checkbox">
          <NysCheckboxgroup
            label="Which parks have you visited?"
            description="Select all that apply."
          >
            <NysCheckbox name="parks" value="adirondack" label="Adirondack Park" checked />
            <NysCheckbox name="parks" value="catskill" label="Catskill Park" />
            <NysCheckbox
              name="parks"
              value="letchworth"
              label="Letchworth State Park"
              onNysChange={(e: CustomEvent) => log(`nys-change: letchworth ${JSON.stringify(e.detail)}`)}
            />
          </NysCheckboxgroup>
        </Section>

        <Section title="Combobox">
          <NysCombobox label="Favorite trail" name="trail" description="Start typing to filter.">
            <option value="van-hoevenberg">Van Hoevenberg Trail</option>
            <option value="northeast">Northeast Trail</option>
            <option value="range">Great Range Traverse</option>
          </NysCombobox>
        </Section>

        <Section title="Datepicker">
          <NysDatepicker label="Permit start date" name="permit-start" />
        </Section>

        <Section title="Divider">
          <NysDivider />
        </Section>

        <Section title="Dropdown menu">
          <div className="demo-row">
            <NysButton id="demo-dropdown-trigger" label="Open menu" suffixIcon="chevron_down" />
            <NysDropdownMenu for="demo-dropdown-trigger" label="Account menu">
              <NysDropdownMenuItem label="Profile" href="#profile" prefixIcon="account_circle" />
              <NysDropdownMenuItem label="Settings" href="#settings" prefixIcon="settings" />
              <NysDropdownMenuItem label="Sign out" href="#signout" divider="top" />
            </NysDropdownMenu>
          </div>
        </Section>

        <Section title="Error message">
          <NysErrorMessage showError errorMessage="This field is required." />
        </Section>

        <Section title="File input + file item">
          <div className="demo-stack">
            <NysFileinput label="Upload supporting documents" name="docs" multiple dropzone accept=".pdf,.png" />
            <NysFileItem filename="site-plan.pdf" status="done" />
            <NysFileItem filename="permit-scan.png" status="processing" progress={64} />
          </div>
        </Section>

        <Section title="Icon">
          <div className="demo-row">
            <NysIcon name="check_circle" size="2xl" color="#2e7d32" ariaLabel="Success icon" />
            <NysIcon name="warning" size="2xl" color="#b45309" ariaLabel="Warning icon" />
            <NysIcon name="download" size="2xl" ariaLabel="Download icon" />
          </div>
        </Section>

        <Section title="Icon list">
          <NysIconlist divider>
            <NysIconlistitem icon="calendar_month">July 4, 2026</NysIconlistitem>
            <NysIconlistitem icon="schedule">5:00 PM</NysIconlistitem>
            <NysIconlistitem icon="location_on">Central Park West</NysIconlistitem>
          </NysIconlist>
        </Section>

        <Section title="Label">
          <NysLabel label="Mailing address" description="Where should we send your permit?" />
        </Section>

        <Section title="Modal">
          <NysButton label="Open modal" onNysClick={() => setModalOpen(true)} />
          <NysModal
            heading="Confirm submission"
            subheading="This closes on Escape or the X button."
            open={modalOpen}
            onNysClose={() => setModalOpen(false)}
          >
            <p>Your application will be submitted to the reviewing agency.</p>
            <div slot="actions">
              <NysButton label="Cancel" variant="outline" onNysClick={() => setModalOpen(false)} />
              <NysButton label="Submit" onNysClick={() => setModalOpen(false)} />
            </div>
          </NysModal>
        </Section>

        <Section title="Pagination">
          <NysPagination
            currentPage={page}
            totalPages={10}
            onNysChange={(e: CustomEvent<{ page?: number; currentPage?: number }>) => {
              const next = e.detail?.page ?? e.detail?.currentPage;
              if (typeof next === "number") setPage(next);
              log(`nys-change: pagination → ${JSON.stringify(e.detail)}`);
            }}
          />
        </Section>

        <Section title="Process list">
          <NysProcesslist>
            <NysProcesslistitem label="Create an account">
              Register with your email address.
            </NysProcesslistitem>
            <NysProcesslistitem label="Complete the application">
              Fill in every required field.
            </NysProcesslistitem>
            <NysProcesslistitem label="Submit for review">
              An agency reviewer responds within 10 business days.
            </NysProcesslistitem>
          </NysProcesslist>
        </Section>

        <Section title="Radio buttons">
          <NysRadiogroup
            label="Preferred contact method"
            description={`Current selection: ${contactMethod}`}
          >
            <NysRadiobutton
              name="contact"
              value="email"
              label="Email"
              checked={contactMethod === "email"}
              onNysChange={() => setContactMethod("email")}
            />
            <NysRadiobutton
              name="contact"
              value="phone"
              label="Phone"
              checked={contactMethod === "phone"}
              onNysChange={() => setContactMethod("phone")}
            />
            <NysRadiobutton
              name="contact"
              value="mail"
              label="Mail"
              checked={contactMethod === "mail"}
              onNysChange={() => setContactMethod("mail")}
            />
          </NysRadiogroup>
        </Section>

        <Section title="Select">
          <NysSelect
            label="County"
            name="county"
            description={county ? `Selected: ${county}` : "Choose your county."}
            value={county}
            onNysChange={(e: CustomEvent) => {
              setCounty((e.target as HTMLSelectElement).value);
              log(`nys-change: county → ${(e.target as HTMLSelectElement).value}`);
            }}
          >
            <NysOption value="albany" label="Albany" />
            <NysOption value="erie" label="Erie" />
            <NysOption value="kings" label="Kings" />
            <NysOption value="monroe" label="Monroe" />
          </NysSelect>
        </Section>

        <Section title="Stepper">
          <NysStepper label="Permit application" counterText="Step">
            <NysStep label="Personal details" selected />
            <NysStep label="Site information" current />
            <NysStep label="Documents" />
            <NysStep label="Review & submit" />
          </NysStepper>
        </Section>

        <Section title="Tabs">
          <NysTabgroup name="peaks">
            <NysTab label="Marcy" selected />
            <NysTab label="Algonquin" />
            <NysTab label="Haystack" disabled />
            <NysTabpanel>Mount Marcy is the tallest peak in the Adirondacks at 5,344 feet.</NysTabpanel>
            <NysTabpanel>Algonquin Peak is the second tallest at 5,114 feet.</NysTabpanel>
            <NysTabpanel>Mount Haystack is the third tallest at 4,960 feet.</NysTabpanel>
          </NysTabgroup>
        </Section>

        <Section title="Table">
          <NysTable striped sortable>
            <table>
              <caption>New York State High Peaks</caption>
              <thead>
                <tr>
                  <th>Mountain</th>
                  <th>Height (ft)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Marcy</td><td>5,344</td></tr>
                <tr><td>Algonquin</td><td>5,114</td></tr>
                <tr><td>Haystack</td><td>4,960</td></tr>
              </tbody>
            </table>
          </NysTable>
        </Section>

        <Section title="Text input + textarea">
          <div className="demo-stack">
            <NysTextinput
              label="First name"
              name="first-name"
              value={firstName}
              description={firstName ? `Hello, ${firstName}!` : "Controlled input — type to update state."}
              onNysInput={(e: CustomEvent) => setFirstName((e.target as HTMLInputElement).value)}
            />
            <NysTextarea label="Project description" name="description" rows={3} maxlength={280} />
          </div>
        </Section>

        <Section title="Toggle">
          <NysToggle
            label="Email notifications"
            name="notifications"
            checked={toggleOn}
            description={toggleOn ? "Notifications on" : "Notifications off"}
            onNysChange={(e: CustomEvent) => setToggleOn((e.target as HTMLInputElement).checked)}
          />
        </Section>

        <Section title="Tooltip">
          <NysTooltip text="Tooltips describe icons and terse controls." for="tooltip-target">
            <NysButton id="tooltip-target" label="Hover me" variant="outline" />
          </NysTooltip>
        </Section>

        <Section title="Vertical navigation">
          <NysVerticalnav heading="Fishing" headingLevel="h3">
            <ul>
              <li><a href="#">Places to fish</a></li>
              <li><a href="#">Learn to fish</a></li>
            </ul>
            <NysVerticalnavGroup label="Regulations" expanded>
              <ul>
                <li><a href="#">Freshwater</a></li>
                <li><a href="#">Saltwater</a></li>
              </ul>
            </NysVerticalnavGroup>
          </NysVerticalnav>
        </Section>

        <Section title="Video">
          <NysVideo
            titleText="I LOVE NY"
            videourl="https://www.youtube.com/embed/aqz-KE-bpKQ"
            size="md"
            loading="lazy"
          />
        </Section>

        <Section title="Event log">
          <p>The five most recent component events:</p>
          <div className="demo-event-log">
            {eventLog.length === 0 ? <div>(interact with the components above)</div> : null}
            {eventLog.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
          </div>
        </Section>
      </main>

      <NysBacktotop />
      <NysGlobalFooter agencyName="NYS Design System" homepageLink="/">
        <ul>
          <li><a href="https://designsystem.ny.gov/">Documentation</a></li>
          <li><a href="https://github.com/its-hcd/nysds">GitHub</a></li>
        </ul>
      </NysGlobalFooter>
      <NysUnavFooter />
    </>
  );
}
