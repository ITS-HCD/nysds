"use client";

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
  NysTable,
  NysTabpanel,
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

/**
 * Renders every NYSDS component once with representative props, grouped
 * into labeled sections. The smoke test asserts that every nys-* tag on
 * this page is a defined, upgraded custom element.
 */
export function KitchenSinkClient() {
  return (
    <>
      <NysSkipnav href="#main-content" />
      <h1 id="main-content">Kitchen sink</h1>
      <p>
        Every NYSDS component rendered once through the React wrappers, across a server-component boundary,
        grouped by role.
      </p>

      <section>
        <h2>Page chrome</h2>
        <div className="nys-display-flex nys-flex-column nys-flex-gap-300">
          <NysUnavHeader hideTranslate hideSearch />
          <NysGlobalHeader appName="Example app" agencyName="Example Agency" />
          <NysBreadcrumbs>
            <a href="/">Home</a>
            <a href="/kitchen-sink">Kitchen sink</a>
          </NysBreadcrumbs>
        </div>
      </section>

      <section>
        <h2>Content</h2>
        <div className="nys-display-flex nys-flex-column nys-flex-align-start nys-flex-gap-300">
          <NysAccordion>
            <NysAccordionItem heading="First accordion item">
              <p>Accordion content.</p>
            </NysAccordionItem>
          </NysAccordion>

          <div className="nys-display-flex nys-flex-align-center nys-flex-gap-200">
            <NysAvatar initials="NY" />
            <NysBadge label="New" />
            <NysIcon name="close" aria-label="Close icon" />
          </div>

          <NysCard
            heading="Card heading"
            description="A representative card."
            href="https://ny.gov"
          />

          <NysDivider />

          <NysIconlist>
            <NysIconlistitem icon="close">Icon list item</NysIconlistitem>
          </NysIconlist>

          <NysProcesslist>
            <NysProcesslistitem label="Step one" description="Do the first thing" />
          </NysProcesslist>

          <NysStepper label="Stepper">
            <NysStep label="Step A" />
            <NysStep label="Step B" current />
          </NysStepper>

          <NysTabgroup>
            <NysTab id="ks-tab-1" label="First" selected />
            <NysTab id="ks-tab-2" label="Second" />
            <NysTabpanel id="ks-tab-1">First panel</NysTabpanel>
            <NysTabpanel id="ks-tab-2">Second panel</NysTabpanel>
          </NysTabgroup>

          <NysTable>
            <table>
              <thead>
                <tr>
                  <th>Column</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cell</td>
                </tr>
              </tbody>
            </table>
          </NysTable>

          <NysVideo titleText="Example video" videourl="" />
        </div>
      </section>

      <section>
        <h2>Form controls</h2>
        <div className="nys-display-flex nys-flex-column nys-flex-gap-300">
          <NysLabel label="A standalone label" description="With a description" />
          <NysErrorMessage showError errorMessage="A representative error" />

          <NysTextinput label="Text input" name="ks-text" />
          <NysTextarea label="Textarea" name="ks-textarea" />
          <NysSelect label="Select" name="ks-select">
            <NysOption value="a" label="Option A" />
            <option value="b">Option B</option>
          </NysSelect>
          <NysCombobox label="Combobox" name="ks-combobox">
            <option value="one">One</option>
            <option value="two">Two</option>
          </NysCombobox>
          <NysDatepicker label="Datepicker" name="ks-date" />
          <NysCheckbox label="Checkbox" name="ks-checkbox" value="yes" />
          <NysCheckboxgroup label="Checkbox group" name="ks-group">
            <NysCheckbox label="Grouped checkbox" value="g1" />
          </NysCheckboxgroup>
          <NysRadiogroup label="Radio group" name="ks-radio">
            <NysRadiobutton label="Radio one" value="r1" name="ks-radio" />
            <NysRadiobutton label="Radio two" value="r2" name="ks-radio" />
          </NysRadiogroup>
          <NysToggle label="Toggle" name="ks-toggle" />
          <NysFileinput label="File input" name="ks-file" />
          <NysFileItem filename="example.pdf" />

          <div className="nys-display-flex nys-flex-align-center nys-flex-gap-200">
            <NysButton label="Primary action" />
          </div>
        </div>
      </section>

      <section>
        <h2>Feedback and overlays</h2>
        <div className="nys-display-flex nys-flex-column nys-flex-align-start nys-flex-gap-300">
          <NysAlert
            heading="Informational alert"
            text="This alert is part of the kitchen sink."
            type="info"
            dismissible
          />

          <NysTooltip text="Tooltip text">
            <NysButton label="Hover me" variant="outline" />
          </NysTooltip>

          <NysButton id="ks-menu-trigger" label="Open menu" />
          <NysDropdownMenu for="ks-menu-trigger" label="Kitchen sink menu">
            <NysDropdownMenuItem label="Menu item" />
          </NysDropdownMenu>

          <NysModal heading="Kitchen sink modal" open={false}>
            <p>Modal body.</p>
          </NysModal>
        </div>
      </section>

      <section>
        <h2>Navigation</h2>
        <div className="nys-display-flex nys-flex-column nys-flex-align-start nys-flex-gap-300">
          <NysPagination totalPages={5} currentPage={1} />

          <NysVerticalnav heading="Section navigation">
            <NysVerticalnavGroup label="Group">
              <a href="/kitchen-sink">A link</a>
            </NysVerticalnavGroup>
          </NysVerticalnav>

          <NysBacktotop />
        </div>
      </section>

      <section>
        <h2>Footer</h2>
        <div className="nys-display-flex nys-flex-column nys-flex-gap-300">
          <NysGlobalFooter agencyName="Example Agency" homepageLink="https://ny.gov" />
          <NysUnavFooter />
        </div>
      </section>

      <div data-testid="kitchen-sink-ready" />
    </>
  );
}
