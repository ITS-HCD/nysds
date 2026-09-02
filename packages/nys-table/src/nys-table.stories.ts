import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-table";
import "@nysds/nys-button";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Table",
  component: "nys-table",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          '`<nys-table>` is a responsive table component that can display native HTML tables,\nsupports striped and bordered styling, sortable columns, and CSV download.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysTable id="table1" name="table1">\n  <table>\n    <caption>New York State High Peaks and Popular Hikes</caption>\n    <tbody>\n      <tr>\n        <th>Mountain</th>\n        <th>Peak Height (ft)</th>\n        <th>Hike Name</th>\n      </tr>\n      <tr>\n        <td>Marcy</td>\n        <td>5,344</td>\n        <td>Van Hoevenberg Trail</td>\n      </tr>\n      <tr>\n        <td>Algonquin</td>\n        <td>5,114</td>\n        <td>Northeast Trail</td>\n      </tr>\n      <tr>\n        <td>Haystack</td>\n        <td>4,960</td>\n        <td>Johns Brook Trail</td>\n      </tr>\n      <tr>\n        <td>Skylight</td>\n        <td>4,926</td>\n        <td>Lake Tear Trail</td>\n      </tr>\n      <tr>\n        <td>Whiteface</td>\n        <td>4,867</td>\n        <td>Whiteface Mountain Trail</td>\n      </tr>\n    </tbody>\n  </table>\n</NysTable>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-table id="table1" name="table1">\n  <table>\n    <caption>New York State High Peaks and Popular Hikes</caption>\n    <tbody>\n      <tr>\n        <th>Mountain</th>\n        <th>Peak Height (ft)</th>\n        <th>Hike Name</th>\n      </tr>\n      <tr>\n        <td>Marcy</td>\n        <td>5,344</td>\n        <td>Van Hoevenberg Trail</td>\n      </tr>\n      <tr>\n        <td>Algonquin</td>\n        <td>5,114</td>\n        <td>Northeast Trail</td>\n      </tr>\n      <tr>\n        <td>Haystack</td>\n        <td>4,960</td>\n        <td>Johns Brook Trail</td>\n      </tr>\n      <tr>\n        <td>Skylight</td>\n        <td>4,926</td>\n        <td>Lake Tear Trail</td>\n      </tr>\n      <tr>\n        <td>Whiteface</td>\n        <td>4,867</td>\n        <td>Whiteface Mountain Trail</td>\n      </tr>\n    </tbody>\n  </table>\n</nys-table>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    name: "table1",
    striped: false,
    sortable: false,
    bordered: false,
    download: "",
  },
  render: (args) => {
    return html`
      <nys-table
        id="table1"
        name=${args.name}
        ?striped=${args.striped}
        ?sortable=${args.sortable}
        ?bordered=${args.bordered}
        download=${args.download}
      >
        <table>
          <caption>
            New York State High Peaks and Popular Hikes
          </caption>
          <tr>
            <th>Mountain</th>
            <th>Peak Height (ft)</th>
            <th>Hike Name</th>
          </tr>
          <tr>
            <td>Marcy</td>
            <td>5,344</td>
            <td>Van Hoevenberg Trail</td>
          </tr>
          <tr>
            <td>Algonquin</td>
            <td>5,114</td>
            <td>Northeast Trail</td>
          </tr>
          <tr>
            <td>Haystack</td>
            <td>4,960</td>
            <td>Johns Brook Trail</td>
          </tr>
          <tr>
            <td>Skylight</td>
            <td>4,926</td>
            <td>Lake Tear Trail</td>
          </tr>
          <tr>
            <td>Whiteface</td>
            <td>4,867</td>
            <td>Whiteface Mountain Trail</td>
          </tr>
        </table>
      </nys-table>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-table id="table1" name="table1">
  <table>
    <caption>New York State High Peaks and Popular Hikes</caption>
    <tr>
      <th>Mountain</th>
      <th>Peak Height (ft)</th>
      <th>Hike Name</th>
    </tr>
    <tr>
      <td>Marcy</td>
      <td>5,344</td>
      <td>Van Hoevenberg Trail</td>
    </tr>
    <tr>
      <td>Algonquin</td>
      <td>5,114</td>
      <td>Northeast Trail</td>
    </tr>
    <tr>
      <td>Haystack</td>
      <td>4,960</td>
      <td>Johns Brook Trail</td>
    </tr>
    <tr>
      <td>Skylight</td>
      <td>4,926</td>
      <td>Lake Tear Trail</td>
    </tr>
    <tr>
      <td>Whiteface</td>
      <td>4,867</td>
      <td>Whiteface Mountain Trail</td>
    </tr>
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const Striped: Story = {
  render: () => {
    return html`
      <nys-table id="table2" name="table2" striped>
        <table>
          <caption>
            New York State High Peaks and Popular Hikes
          </caption>
          <tr>
            <th>Mountain</th>
            <th>Peak Height (ft)</th>
            <th>Hike Name</th>
          </tr>
          <tr>
            <td>Marcy</td>
            <td>5,344</td>
            <td>Van Hoevenberg Trail</td>
          </tr>
          <tr>
            <td>Haystack</td>
            <td>4,960</td>
            <td>Johns Brook Trail</td>
          </tr>
          <tr>
            <td>Skylight</td>
            <td>4,926</td>
            <td>Lake Tear Trail</td>
          </tr>
          <tr>
            <td>Whiteface</td>
            <td>4,867</td>
            <td>Whiteface Mountain Trail</td>
          </tr>
        </table>
      </nys-table>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-table id="table2" name="table2" striped>
  <table>
    <caption>New York State High Peaks and Popular Hikes</caption>
    <tr>
      <th>Mountain</th>
      <th>Peak Height (ft)</th>
      <th>Hike Name</th>
    </tr>
    <tr>
      <td>Marcy</td>
      <td>5,344</td>
      <td>Van Hoevenberg Trail</td>
    </tr>
    <tr>
      <td>Haystack</td>
      <td>4,960</td>
      <td>Johns Brook Trail</td>
    </tr>
    <tr>
      <td>Skylight</td>
      <td>4,926</td>
      <td>Lake Tear Trail</td>
    </tr>
    <tr>
      <td>Whiteface</td>
      <td>4,867</td>
      <td>Whiteface Mountain Trail</td>
    </tr>
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const Bordered: Story = {
  render: () => {
    return html`
      <nys-table id="table3" name="table3" bordered>
        <table>
          <caption>
            New York State High Peaks and Popular Hikes
          </caption>
          <tr>
            <th>Mountain</th>
            <th>Peak Height (ft)</th>
            <th>Hike Name</th>
          </tr>
          <tr>
            <td>Marcy</td>
            <td>5,344</td>
            <td>Van Hoevenberg Trail</td>
          </tr>
          <tr>
            <td>Haystack</td>
            <td>4,960</td>
            <td>Johns Brook Trail</td>
          </tr>
          <tr>
            <td>Skylight</td>
            <td>4,926</td>
            <td>Lake Tear Trail</td>
          </tr>
          <tr>
            <td>Whiteface</td>
            <td>4,867</td>
            <td>Whiteface Mountain Trail</td>
          </tr>
        </table>
      </nys-table>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-table id="table3" name="table3" bordered>
  <table>
    <caption>New York State High Peaks and Popular Hikes</caption>
    <tr>
      <th>Mountain</th>
      <th>Peak Height (ft)</th>
      <th>Hike Name</th>
    </tr>
    <tr>
      <td>Marcy</td>
      <td>5,344</td>
      <td>Van Hoevenberg Trail</td>
    </tr>
    <tr>
      <td>Haystack</td>
      <td>4,960</td>
      <td>Johns Brook Trail</td>
    </tr>
    <tr>
      <td>Skylight</td>
      <td>4,926</td>
      <td>Lake Tear Trail</td>
    </tr>
    <tr>
      <td>Whiteface</td>
      <td>4,867</td>
      <td>Whiteface Mountain Trail</td>
    </tr>
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const Sortable: Story = {
  render: () => {
    return html`
      <nys-table id="table4" name="table4" sortable>
        <table>
          <caption>
            New York State High Peaks and Popular Hikes
          </caption>
          <tr>
            <th>Mountain</th>
            <th>Peak Height (ft)</th>
            <th>Hike Name</th>
          </tr>
          <tr>
            <td>Marcy</td>
            <td>5,344</td>
            <td>Van Hoevenberg Trail</td>
          </tr>
          <tr>
            <td>Haystack</td>
            <td>4,960</td>
            <td>Johns Brook Trail</td>
          </tr>
          <tr>
            <td>Skylight</td>
            <td>4,926</td>
            <td>Lake Tear Trail</td>
          </tr>
          <tr>
            <td>Whiteface</td>
            <td>4,867</td>
            <td>Whiteface Mountain Trail</td>
          </tr>
        </table>
      </nys-table>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-table id="table4" name="table4" sortable>
  <table>
    <caption>New York State High Peaks and Popular Hikes</caption>
    <tr>
      <th>Mountain</th>
      <th>Peak Height (ft)</th>
      <th>Hike Name</th>
    </tr>
    <tr>
      <td>Marcy</td>
      <td>5,344</td>
      <td>Van Hoevenberg Trail</td>
    </tr>
    <tr>
      <td>Haystack</td>
      <td>4,960</td>
      <td>Johns Brook Trail</td>
    </tr>
    <tr>
      <td>Skylight</td>
      <td>4,926</td>
      <td>Lake Tear Trail</td>
    </tr>
    <tr>
      <td>Whiteface</td>
      <td>4,867</td>
      <td>Whiteface Mountain Trail</td>
    </tr>
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const Downloadable: Story = {
  render: () => {
    return html`
      <nys-table
        id="table5"
        name="table5"
        download="path/to/downloadable/version/of/table.filetype"
      >
        <table>
          <caption>
            New York State High Peaks and Popular Hikes
          </caption>
          <tr>
            <th>Mountain</th>
            <th>Peak Height (ft)</th>
            <th>Hike Name</th>
          </tr>
          <tr>
            <td>Marcy</td>
            <td>5,344</td>
            <td>Van Hoevenberg Trail</td>
          </tr>
          <tr>
            <td>Haystack</td>
            <td>4,960</td>
            <td>Johns Brook Trail</td>
          </tr>
          <tr>
            <td>Skylight</td>
            <td>4,926</td>
            <td>Lake Tear Trail</td>
          </tr>
          <tr>
            <td>Whiteface</td>
            <td>4,867</td>
            <td>Whiteface Mountain Trail</td>
          </tr>
        </table>
      </nys-table>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-table id="table5" name="table5" download="path/to/downloadable/version/of/table.filetype">
  <table>
    <caption>New York State High Peaks and Popular Hikes</caption>
    <tr>
      <th>Mountain</th>
      <th>Peak Height (ft)</th>
      <th>Hike Name</th>
    </tr>
    <tr>
      <td>Marcy</td>
      <td>5,344</td>
      <td>Van Hoevenberg Trail</td>
    </tr>
    <tr>
      <td>Haystack</td>
      <td>4,960</td>
      <td>Johns Brook Trail</td>
    </tr>
    <tr>
      <td>Skylight</td>
      <td>4,926</td>
      <td>Lake Tear Trail</td>
    </tr>
    <tr>
      <td>Whiteface</td>
      <td>4,867</td>
      <td>Whiteface Mountain Trail</td>
    </tr>
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};
