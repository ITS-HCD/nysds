import { css } from "lit";

export default css`
  svg {
    position: absolute;
    left: -35px;
  }
  .nys-alert__container {
    background-color: #f0f0f0;
    border-left: 0.5rem solid #adadad;
    color: #1b1b1b;
    padding: 1rem 1.5rem;
    font-family: Source Sans Pro Web, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif;
    font-size: 1.06rem;
    line-height: 1.5;
  }

  .nys-alert__heading{
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 0 .5rem 2.5rem;
    font-family: Source Sans Pro Web, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif;
    font-size: 1.33rem;
    line-height: .9;
  }

  .nys-alert__title{
    margin: 0;
  }

  .nys-alert__text{
    margin: 0 0 0 2.5rem;
  }

  /* Alert Types */
  .nys-alert--info {
    background-color: #e7f6f8;
    border-left-color: #00bde3;
  }
  .nys-alert--warning {
    background-color: #faf3d1;
    border-left-color: #ffbe2e;
  }
  .nys-alert--success {
    background-color: #ecf3ec;
    border-left-color: #00a91c;
  }
  .nys-alert--error {
    background-color: #f4e3db;
    border-left-color: #d54309;
  }
  .nys-alert--emergency {
    background-color: #9c3d10;
    border-left-color: #9c3d10;
    color: #fff;
  }
`;
