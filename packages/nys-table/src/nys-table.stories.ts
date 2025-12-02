import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-table";

// Define the structure of the args used in the stories
interface NysTableArgs {
  id: string;
  name: string;
  striped: boolean;
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
    striped: false,
    sortable: false,
    download: "",
  },
  render: (args) => html`
    <nys-table
      .id=${args.id}
      .name=${args.name}
      .striped=${args.striped}
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
