import { css } from "lit";

export default css`
  :host {
    display: block;
    padding: 16px 32px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  span {
    /* light blue */
    color: #00f;
  }
  /* web component where name attribute is set */
  :host([name]) span {
    /* light yellow */
    display: inline-block;
    color: #f00;
  }
  h2 {
    color: #333;
  }
`;
