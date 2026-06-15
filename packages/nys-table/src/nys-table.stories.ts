import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-table";

// Define the structure of the args used in the stories
interface NysTableArgs {
  id: string;
  name: string;
  download: string;
  striped: boolean;
  sortable: boolean;
  bordered: boolean;
}

const meta: Meta<NysTableArgs> = {
  title: "Components/Table",
  component: "nys-table",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    download: { control: "text" },
    striped: { control: "boolean", default: false },
    sortable: { control: "boolean", default: false },
    bordered: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysTableArgs>;

export const BasicTable: Story = {
  args: {
    name: "table1",
  },
  render: (args) => {
    return html`
      <nys-table
        .id=${args.id}
        ?striped=${args.striped}
        ?sortable=${args.sortable}
        ?bordered=${args.bordered}
        .name=${args.name}
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
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const StripedTable: Story = {
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
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const BorderedTable: Story = {
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
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const SortableTable: Story = {
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
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};

export const DownloadableTable: Story = {
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
  </table>
</nys-table>`,
        type: "auto",
      },
    },
  },
};
