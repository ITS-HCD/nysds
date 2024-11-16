import { css } from "lit";

export default css`
  .nys-alert__container {
    background-color: #f0f0f0;
    border-left: 0.5rem solid #adadad;
    color: #1b1b1b;
    padding: 1rem 1.5rem;
    font-family: Source Sans Pro Web, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif;
    font-size: 1.06rem;
    line-height: 1.5;
  }

  svg {
    position: absolute;
    left: -30px;
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
`;
