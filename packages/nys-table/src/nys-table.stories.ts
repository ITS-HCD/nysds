import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-table";

// Define the structure of the args used in the stories
interface NysTableArgs {
  id: string;
  name: string;
  striped: boolean;
  bordered: boolean;
  sortable: boolean;
  download: string;
}

const meta: Meta<NysTableArgs> = {
  title: "Components/Table",
  component: "nys-table",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    striped: { control: "boolean" },
    bordered: { control: "boolean" },
    sortable: { control: "boolean" },
    download: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysTableArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "table1",
    name: "table1",
  },
  render: (args) => html`
    <nys-table
      .id=${args.id}
      .name=${args.name}
      .striped=${args.striped}
      .bordered=${args.bordered}
      .sortable=${args.sortable}
      .download=${args.download}
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
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-table
  id="table1"
  name="table1"
></nys-table>`,
        type: "auto",
      },
    },
  },
};

export const Striped: Story = {
  args: {
    id: "table2",
    name: "table2",
    striped: true,
  },

  render: (args) => html`
    <nys-table
      .id=${args.id}
      .name=${args.name}
      .striped=${args.striped}
      .bordered=${args.bordered}
      .sortable=${args.sortable}
      .download=${args.download}
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
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-table
  id="table2"
  name="table2"
  striped
></nys-table>`,

        type: "auto",
      },
    },
  },
};

export const Bordered: Story = {
  args: {
    id: "table3",
    name: "table3",
    bordered: true,
  },

  render: (args) => html`
    <nys-table
      .id=${args.id}
      .name=${args.name}
      .striped=${args.striped}
      .bordered=${args.bordered}
      .sortable=${args.sortable}
      .download=${args.download}
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
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-table
  id="table3"
  name="table3"
  bordered
></nys-table>`,

        type: "auto",
      },
    },
  },
};

export const Sortable: Story = {
  args: {
    id: "table4",
    name: "table4",
    sortable: true,
  },

  render: (args) => html`
    <nys-table
      .id=${args.id}
      .name=${args.name}
      .striped=${args.striped}
      .bordered=${args.bordered}
      .sortable=${args.sortable}
      .download=${args.download}
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
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-table
  id="table4"
  name="table4"
  sortable
></nys-table>`,

        type: "auto",
      },
    },
  },
};

export const Downloadable: Story = {
  args: {
    id: "table5",
    name: "table5",
    download: "path/to/downloadable/version/of/table.filetype",
  },

  render: (args) => html`
    <nys-table
      .id=${args.id}
      .name=${args.name}
      .striped=${args.striped}
      .bordered=${args.bordered}
      .sortable=${args.sortable}
      .download=${args.download}
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
  `,

  parameters: {
    docs: {
      source: {
        code: `
<nys-table
  id="table5"
  name="table5"
  download="path/to/downloadable/version/of/table.filetype"
></nys-table>`,

        type: "auto",
      },
    },
  },
};
