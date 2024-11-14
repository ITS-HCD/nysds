const iconLibrary: Record<string, string> = {
  // --------- UX Team Main Library (below) --------- //
  "edit-square": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
  <path d="M2 21.0125C1.45 21.0125 0.979167 20.8167 0.5875 20.425C0.195833 20.0333 0 19.5625 0 19.0125V5.0125C0 4.4625 0.195833 3.99167 0.5875 3.6C0.979167 3.20834 1.45 3.0125 2 3.0125H8.525C8.85833 3.0125 9.10833 3.11667 9.275 3.325C9.44167 3.53334 9.525 3.7625 9.525 4.0125C9.525 4.2625 9.4375 4.49167 9.2625 4.7C9.0875 4.90834 8.83333 5.0125 8.5 5.0125H2V19.0125H16V12.4875C16 12.1542 16.1042 11.9042 16.3125 11.7375C16.5208 11.5708 16.75 11.4875 17 11.4875C17.25 11.4875 17.4792 11.5708 17.6875 11.7375C17.8958 11.9042 18 12.1542 18 12.4875V19.0125C18 19.5625 17.8042 20.0333 17.4125 20.425C17.0208 20.8167 16.55 21.0125 16 21.0125H2ZM6 14.0125V11.5875C6 11.3208 6.05 11.0667 6.15 10.825C6.25 10.5833 6.39167 10.3708 6.575 10.1875L15.175 1.5875C15.375 1.3875 15.6 1.2375 15.85 1.1375C16.1 1.0375 16.35 0.987503 16.6 0.987503C16.8667 0.987503 17.1208 1.0375 17.3625 1.1375C17.6042 1.2375 17.825 1.3875 18.025 1.5875L19.425 3.0125C19.6083 3.2125 19.75 3.43334 19.85 3.675C19.95 3.91667 20 4.1625 20 4.4125C20 4.6625 19.9542 4.90834 19.8625 5.15C19.7708 5.39167 19.625 5.6125 19.425 5.8125L10.825 14.4125C10.6417 14.5958 10.4292 14.7417 10.1875 14.85C9.94583 14.9583 9.69167 15.0125 9.425 15.0125H7C6.71667 15.0125 6.47917 14.9167 6.2875 14.725C6.09583 14.5333 6 14.2958 6 14.0125ZM8 13.0125H9.4L15.2 7.2125L14.5 6.5125L13.775 5.8125L8 11.5875V13.0125Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  publish: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M7 7.85L5.125 9.725C4.925 9.925 4.6875 10.0208 4.4125 10.0125C4.1375 10.0042 3.9 9.9 3.7 9.7C3.51667 9.5 3.42083 9.26667 3.4125 9C3.40417 8.73333 3.5 8.5 3.7 8.3L7.3 4.7C7.4 4.6 7.50833 4.52917 7.625 4.4875C7.74167 4.44583 7.86667 4.425 8 4.425C8.13333 4.425 8.25833 4.44583 8.375 4.4875C8.49167 4.52917 8.6 4.6 8.7 4.7L12.3 8.3C12.5 8.5 12.5958 8.73333 12.5875 9C12.5792 9.26667 12.4833 9.5 12.3 9.7C12.1 9.9 11.8625 10.0042 11.5875 10.0125C11.3125 10.0208 11.075 9.925 10.875 9.725L9 7.85V15C9 15.2833 8.90417 15.5208 8.7125 15.7125C8.52083 15.9042 8.28333 16 8 16C7.71667 16 7.47917 15.9042 7.2875 15.7125C7.09583 15.5208 7 15.2833 7 15V7.85ZM0 4V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2V4C16 4.28333 15.9042 4.52083 15.7125 4.7125C15.5208 4.90417 15.2833 5 15 5C14.7167 5 14.4792 4.90417 14.2875 4.7125C14.0958 4.52083 14 4.28333 14 4V2H2V4C2 4.28333 1.90417 4.52083 1.7125 4.7125C1.52083 4.90417 1.28333 5 1 5C0.716667 5 0.479167 4.90417 0.2875 4.7125C0.0958333 4.52083 0 4.28333 0 4Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8 11.575C7.86667 11.575 7.74167 11.5542 7.625 11.5125C7.50833 11.4708 7.4 11.4 7.3 11.3L3.7 7.7C3.5 7.5 3.40417 7.26667 3.4125 7C3.42083 6.73333 3.51667 6.5 3.7 6.3C3.9 6.1 4.1375 5.99583 4.4125 5.9875C4.6875 5.97917 4.925 6.075 5.125 6.275L7 8.15V1C7 0.716667 7.09583 0.479167 7.2875 0.2875C7.47917 0.0958333 7.71667 0 8 0C8.28333 0 8.52083 0.0958333 8.7125 0.2875C8.90417 0.479167 9 0.716667 9 1V8.15L10.875 6.275C11.075 6.075 11.3125 5.97917 11.5875 5.9875C11.8625 5.99583 12.1 6.1 12.3 6.3C12.4833 6.5 12.5792 6.73333 12.5875 7C12.5958 7.26667 12.5 7.5 12.3 7.7L8.7 11.3C8.6 11.4 8.49167 11.4708 8.375 11.5125C8.25833 11.5542 8.13333 11.575 8 11.575ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V12C0 11.7167 0.0958333 11.4792 0.2875 11.2875C0.479167 11.0958 0.716667 11 1 11C1.28333 11 1.52083 11.0958 1.7125 11.2875C1.90417 11.4792 2 11.7167 2 12V14H14V12C14 11.7167 14.0958 11.4792 14.2875 11.2875C14.4792 11.0958 14.7167 11 15 11C15.2833 11 15.5208 11.0958 15.7125 11.2875C15.9042 11.4792 16 11.7167 16 12V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "download-done": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M5.544 8.95L13.994 0.499997C14.194 0.299997 14.4315 0.199997 14.7065 0.199997C14.9815 0.199997 15.219 0.299997 15.419 0.499997C15.619 0.699997 15.719 0.937497 15.719 1.2125C15.719 1.4875 15.619 1.725 15.419 1.925L6.244 11.1C6.044 11.3 5.81067 11.4 5.544 11.4C5.27733 11.4 5.044 11.3 4.844 11.1L0.568998 6.825C0.368998 6.625 0.273165 6.3875 0.281498 6.1125C0.289832 5.8375 0.393998 5.6 0.593998 5.4C0.793998 5.2 1.0315 5.1 1.3065 5.1C1.5815 5.1 1.819 5.2 2.019 5.4L5.544 8.95ZM1.994 15.8C1.71066 15.8 1.47317 15.7042 1.2815 15.5125C1.08983 15.3208 0.993998 15.0833 0.993998 14.8C0.993998 14.5167 1.08983 14.2792 1.2815 14.0875C1.47317 13.8958 1.71066 13.8 1.994 13.8H13.994C14.2773 13.8 14.5148 13.8958 14.7065 14.0875C14.8982 14.2792 14.994 14.5167 14.994 14.8C14.994 15.0833 14.8982 15.3208 14.7065 15.5125C14.5148 15.7042 14.2773 15.8 13.994 15.8H1.994Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "upload-file": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
  <path d="M7 12.825V16C7 16.2833 7.09583 16.5208 7.2875 16.7125C7.47917 16.9042 7.71667 17 8 17C8.28333 17 8.52083 16.9042 8.7125 16.7125C8.90417 16.5208 9 16.2833 9 16V12.825L9.9 13.725C10 13.825 10.1125 13.9 10.2375 13.95C10.3625 14 10.4875 14.0208 10.6125 14.0125C10.7375 14.0042 10.8583 13.975 10.975 13.925C11.0917 13.875 11.2 13.8 11.3 13.7C11.4833 13.5 11.5792 13.2667 11.5875 13C11.5958 12.7333 11.5 12.5 11.3 12.3L8.7 9.7C8.6 9.6 8.49167 9.52917 8.375 9.4875C8.25833 9.44583 8.13333 9.425 8 9.425C7.86667 9.425 7.74167 9.44583 7.625 9.4875C7.50833 9.52917 7.4 9.6 7.3 9.7L4.7 12.3C4.5 12.5 4.40417 12.7333 4.4125 13C4.42083 13.2667 4.525 13.5 4.725 13.7C4.925 13.8833 5.15833 13.9792 5.425 13.9875C5.69167 13.9958 5.925 13.9 6.125 13.7L7 12.825ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9.175C9.44167 0 9.69583 0.05 9.9375 0.15C10.1792 0.25 10.3917 0.391667 10.575 0.575L15.425 5.425C15.6083 5.60833 15.75 5.82083 15.85 6.0625C15.95 6.30417 16 6.55833 16 6.825V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H2ZM9 6V2H2V18H14V7H10C9.71667 7 9.47917 6.90417 9.2875 6.7125C9.09583 6.52083 9 6.28333 9 6Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "drive-folder-upload": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H7.175C7.44167 0 7.69583 0.05 7.9375 0.15C8.17917 0.25 8.39167 0.391667 8.575 0.575L10 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM2 14H18V4H9.175L7.175 2H2V14ZM10 13C10.2833 13 10.5208 12.9042 10.7125 12.7125C10.9042 12.5208 11 12.2833 11 12V8.8L11.9 9.7C12.0833 9.88333 12.3167 9.975 12.6 9.975C12.8833 9.975 13.1167 9.88333 13.3 9.7C13.4833 9.51667 13.575 9.28333 13.575 9C13.575 8.71667 13.4833 8.48333 13.3 8.3L10.7 5.7C10.5 5.5 10.2667 5.4 10 5.4C9.73333 5.4 9.5 5.5 9.3 5.7L6.7 8.3C6.51667 8.48333 6.425 8.71667 6.425 9C6.425 9.28333 6.51667 9.51667 6.7 9.7C6.88333 9.88333 7.11667 9.975 7.4 9.975C7.68333 9.975 7.91667 9.88333 8.1 9.7L9 8.8V12C9 12.2833 9.09583 12.5208 9.2875 12.7125C9.47917 12.9042 9.71667 13 10 13Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "more-vert": `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="16" viewBox="0 0 4 16" fill="none">
  <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "arrow-back": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M3.6125 8.9935L8.5125 13.8935C8.7125 14.0935 8.80834 14.3268 8.8 14.5935C8.79167 14.8602 8.6875 15.0935 8.4875 15.2935C8.2875 15.4768 8.05417 15.5727 7.7875 15.581C7.52083 15.5893 7.2875 15.4935 7.0875 15.2935L0.487502 8.6935C0.387502 8.5935 0.316668 8.48517 0.275002 8.3685C0.233335 8.25184 0.212502 8.12684 0.212502 7.9935C0.212502 7.86017 0.233335 7.73517 0.275002 7.6185C0.316668 7.50184 0.387502 7.3935 0.487502 7.2935L7.0875 0.693503C7.27083 0.510169 7.5 0.418503 7.775 0.418503C8.05 0.418503 8.2875 0.510169 8.4875 0.693503C8.6875 0.893503 8.7875 1.131 8.7875 1.406C8.7875 1.681 8.6875 1.9185 8.4875 2.1185L3.6125 6.9935H14.7875C15.0708 6.9935 15.3083 7.08934 15.5 7.281C15.6917 7.47267 15.7875 7.71017 15.7875 7.9935C15.7875 8.27684 15.6917 8.51434 15.5 8.706C15.3083 8.89767 15.0708 8.9935 14.7875 8.9935H3.6125Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "arrow-left": `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20" fill="none">
  <path d="M3.49999 10.0065L10.85 17.3565C11.1 17.6065 11.2208 17.8981 11.2125 18.2315C11.2042 18.5648 11.075 18.8565 10.825 19.1065C10.575 19.3565 10.2833 19.4815 9.94999 19.4815C9.61666 19.4815 9.32499 19.3565 9.07499 19.1065L1.37499 11.4315C1.17499 11.2315 1.02499 11.0065 0.924994 10.7565C0.824994 10.5065 0.774994 10.2565 0.774994 10.0065C0.774994 9.75645 0.824994 9.50645 0.924994 9.25645C1.02499 9.00645 1.17499 8.78145 1.37499 8.58145L9.07499 0.88145C9.32499 0.63145 9.62083 0.510617 9.96249 0.51895C10.3042 0.527284 10.6 0.65645 10.85 0.90645C11.1 1.15645 11.225 1.44812 11.225 1.78145C11.225 2.11478 11.1 2.40645 10.85 2.65645L3.49999 10.0065Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "arrow-right": `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20" fill="none">
  <path d="M8.50001 9.99355L1.15001 2.64355C0.900008 2.39355 0.779174 2.10188 0.787508 1.76855C0.795841 1.43521 0.925008 1.14355 1.17501 0.893548C1.42501 0.643548 1.71667 0.518548 2.05001 0.518548C2.38334 0.518548 2.67501 0.643548 2.92501 0.893548L10.625 8.56855C10.825 8.76855 10.975 8.99355 11.075 9.24355C11.175 9.49355 11.225 9.74355 11.225 9.99355C11.225 10.2435 11.175 10.4935 11.075 10.7435C10.975 10.9935 10.825 11.2185 10.625 11.4185L2.92501 19.1185C2.67501 19.3685 2.37917 19.4894 2.03751 19.481C1.69584 19.4727 1.40001 19.3435 1.15001 19.0935C0.900006 18.8435 0.775006 18.5519 0.775006 18.2185C0.775006 17.8852 0.900006 17.5935 1.15001 17.3435L8.50001 9.99355Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "arrow-down": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
  <path d="M10.0065 8.5L17.3565 1.15C17.6065 0.899999 17.8981 0.779165 18.2315 0.787499C18.5648 0.795832 18.8565 0.924999 19.1065 1.175C19.3565 1.425 19.4815 1.71667 19.4815 2.05C19.4815 2.38333 19.3565 2.675 19.1065 2.925L11.4315 10.625C11.2315 10.825 11.0065 10.975 10.7565 11.075C10.5065 11.175 10.2565 11.225 10.0065 11.225C9.75646 11.225 9.50646 11.175 9.25646 11.075C9.00646 10.975 8.78146 10.825 8.58146 10.625L0.881458 2.925C0.631458 2.675 0.510625 2.37916 0.518958 2.0375C0.527291 1.69583 0.656458 1.4 0.906458 1.15C1.15646 0.899999 1.44812 0.774999 1.78146 0.774999C2.11479 0.774999 2.40646 0.899999 2.65646 1.15L10.0065 8.5Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "arrow-up": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
  <path d="M9.99354 3.5L2.64354 10.85C2.39354 11.1 2.10188 11.2208 1.76854 11.2125C1.43521 11.2042 1.14354 11.075 0.893541 10.825C0.643541 10.575 0.518541 10.2833 0.518541 9.95C0.518541 9.61667 0.643541 9.325 0.893541 9.075L8.56854 1.375C8.76854 1.175 8.99354 1.025 9.24354 0.925002C9.49354 0.825002 9.74354 0.775002 9.99354 0.775002C10.2435 0.775002 10.4935 0.825002 10.7435 0.925002C10.9935 1.025 11.2185 1.175 11.4185 1.375L19.1185 9.075C19.3685 9.325 19.4894 9.62084 19.481 9.9625C19.4727 10.3042 19.3435 10.6 19.0935 10.85C18.8435 11.1 18.5519 11.225 18.2185 11.225C17.8852 11.225 17.5935 11.1 17.3435 10.85L9.99354 3.5Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
  <path d="M5.5565 9.1625L14.0315 0.687501C14.2315 0.487501 14.4648 0.387501 14.7315 0.387501C14.9982 0.387501 15.2315 0.487501 15.4315 0.687501C15.6315 0.887501 15.7315 1.125 15.7315 1.4C15.7315 1.675 15.6315 1.9125 15.4315 2.1125L6.2565 11.3125C6.0565 11.5125 5.82317 11.6125 5.5565 11.6125C5.28983 11.6125 5.0565 11.5125 4.8565 11.3125L0.556499 7.0125C0.356499 6.8125 0.260666 6.575 0.268999 6.3C0.277333 6.025 0.381499 5.7875 0.581499 5.5875C0.781499 5.3875 1.019 5.2875 1.294 5.2875C1.569 5.2875 1.8065 5.3875 2.0065 5.5875L5.5565 9.1625Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "calendar-month": `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
  <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V1C3 0.716667 3.09583 0.479167 3.2875 0.2875C3.47917 0.0958333 3.71667 0 4 0C4.28333 0 4.52083 0.0958333 4.7125 0.2875C4.90417 0.479167 5 0.716667 5 1V2H13V1C13 0.716667 13.0958 0.479167 13.2875 0.2875C13.4792 0.0958333 13.7167 0 14 0C14.2833 0 14.5208 0.0958333 14.7125 0.2875C14.9042 0.479167 15 0.716667 15 1V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM9 12C8.71667 12 8.47917 11.9042 8.2875 11.7125C8.09583 11.5208 8 11.2833 8 11C8 10.7167 8.09583 10.4792 8.2875 10.2875C8.47917 10.0958 8.71667 10 9 10C9.28333 10 9.52083 10.0958 9.7125 10.2875C9.90417 10.4792 10 10.7167 10 11C10 11.2833 9.90417 11.5208 9.7125 11.7125C9.52083 11.9042 9.28333 12 9 12ZM5 12C4.71667 12 4.47917 11.9042 4.2875 11.7125C4.09583 11.5208 4 11.2833 4 11C4 10.7167 4.09583 10.4792 4.2875 10.2875C4.47917 10.0958 4.71667 10 5 10C5.28333 10 5.52083 10.0958 5.7125 10.2875C5.90417 10.4792 6 10.7167 6 11C6 11.2833 5.90417 11.5208 5.7125 11.7125C5.52083 11.9042 5.28333 12 5 12ZM13 12C12.7167 12 12.4792 11.9042 12.2875 11.7125C12.0958 11.5208 12 11.2833 12 11C12 10.7167 12.0958 10.4792 12.2875 10.2875C12.4792 10.0958 12.7167 10 13 10C13.2833 10 13.5208 10.0958 13.7125 10.2875C13.9042 10.4792 14 10.7167 14 11C14 11.2833 13.9042 11.5208 13.7125 11.7125C13.5208 11.9042 13.2833 12 13 12ZM9 16C8.71667 16 8.47917 15.9042 8.2875 15.7125C8.09583 15.5208 8 15.2833 8 15C8 14.7167 8.09583 14.4792 8.2875 14.2875C8.47917 14.0958 8.71667 14 9 14C9.28333 14 9.52083 14.0958 9.7125 14.2875C9.90417 14.4792 10 14.7167 10 15C10 15.2833 9.90417 15.5208 9.7125 15.7125C9.52083 15.9042 9.28333 16 9 16ZM5 16C4.71667 16 4.47917 15.9042 4.2875 15.7125C4.09583 15.5208 4 15.2833 4 15C4 14.7167 4.09583 14.4792 4.2875 14.2875C4.47917 14.0958 4.71667 14 5 14C5.28333 14 5.52083 14.0958 5.7125 14.2875C5.90417 14.4792 6 14.7167 6 15C6 15.2833 5.90417 15.5208 5.7125 15.7125C5.52083 15.9042 5.28333 16 5 16ZM13 16C12.7167 16 12.4792 15.9042 12.2875 15.7125C12.0958 15.5208 12 15.2833 12 15C12 14.7167 12.0958 14.4792 12.2875 14.2875C12.4792 14.0958 12.7167 14 13 14C13.2833 14 13.5208 14.0958 13.7125 14.2875C13.9042 14.4792 14 14.7167 14 15C14 15.2833 13.9042 15.5208 13.7125 15.7125C13.5208 15.9042 13.2833 16 13 16Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
  <path d="M1.725 18C1.54167 18 1.375 17.9542 1.225 17.8625C1.075 17.7708 0.958337 17.65 0.875003 17.5C0.79167 17.35 0.745837 17.1875 0.737503 17.0125C0.72917 16.8375 0.775003 16.6667 0.875003 16.5L10.125 0.5C10.225 0.333333 10.3542 0.208333 10.5125 0.125C10.6708 0.0416667 10.8333 0 11 0C11.1667 0 11.3292 0.0416667 11.4875 0.125C11.6458 0.208333 11.775 0.333333 11.875 0.5L21.125 16.5C21.225 16.6667 21.2708 16.8375 21.2625 17.0125C21.2542 17.1875 21.2083 17.35 21.125 17.5C21.0417 17.65 20.925 17.7708 20.775 17.8625C20.625 17.9542 20.4583 18 20.275 18H1.725ZM3.45 16H18.55L11 3L3.45 16ZM11 15C11.2833 15 11.5208 14.9042 11.7125 14.7125C11.9042 14.5208 12 14.2833 12 14C12 13.7167 11.9042 13.4792 11.7125 13.2875C11.5208 13.0958 11.2833 13 11 13C10.7167 13 10.4792 13.0958 10.2875 13.2875C10.0958 13.4792 10 13.7167 10 14C10 14.2833 10.0958 14.5208 10.2875 14.7125C10.4792 14.9042 10.7167 15 11 15ZM11 12C11.2833 12 11.5208 11.9042 11.7125 11.7125C11.9042 11.5208 12 11.2833 12 11V8C12 7.71667 11.9042 7.47917 11.7125 7.2875C11.5208 7.09583 11.2833 7 11 7C10.7167 7 10.4792 7.09583 10.2875 7.2875C10.0958 7.47917 10 7.71667 10 8V11C10 11.2833 10.0958 11.5208 10.2875 11.7125C10.4792 11.9042 10.7167 12 11 12Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "check-circle": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  cancel: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M10 11.4L12.9 14.3C13.0833 14.4833 13.3167 14.575 13.6 14.575C13.8833 14.575 14.1167 14.4833 14.3 14.3C14.4833 14.1167 14.575 13.8833 14.575 13.6C14.575 13.3167 14.4833 13.0833 14.3 12.9L11.4 10L14.3 7.1C14.4833 6.91667 14.575 6.68333 14.575 6.4C14.575 6.11667 14.4833 5.88333 14.3 5.7C14.1167 5.51667 13.8833 5.425 13.6 5.425C13.3167 5.425 13.0833 5.51667 12.9 5.7L10 8.6L7.1 5.7C6.91667 5.51667 6.68333 5.425 6.4 5.425C6.11667 5.425 5.88333 5.51667 5.7 5.7C5.51667 5.88333 5.425 6.11667 5.425 6.4C5.425 6.68333 5.51667 6.91667 5.7 7.1L8.6 10L5.7 12.9C5.51667 13.0833 5.425 13.3167 5.425 13.6C5.425 13.8833 5.51667 14.1167 5.7 14.3C5.88333 14.4833 6.11667 14.575 6.4 14.575C6.68333 14.575 6.91667 14.4833 7.1 14.3L10 11.4ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M7 8.4L2.1 13.3C1.91667 13.4833 1.68334 13.575 1.4 13.575C1.11667 13.575 0.883336 13.4833 0.700003 13.3C0.51667 13.1167 0.425003 12.8833 0.425003 12.6C0.425003 12.3167 0.51667 12.0833 0.700003 11.9L5.6 7L0.700003 2.1C0.51667 1.91667 0.425003 1.68334 0.425003 1.4C0.425003 1.11667 0.51667 0.883336 0.700003 0.700003C0.883336 0.51667 1.11667 0.425003 1.4 0.425003C1.68334 0.425003 1.91667 0.51667 2.1 0.700003L7 5.6L11.9 0.700003C12.0833 0.51667 12.3167 0.425003 12.6 0.425003C12.8833 0.425003 13.1167 0.51667 13.3 0.700003C13.4833 0.883336 13.575 1.11667 13.575 1.4C13.575 1.68334 13.4833 1.91667 13.3 2.1L8.4 7L13.3 11.9C13.4833 12.0833 13.575 12.3167 13.575 12.6C13.575 12.8833 13.4833 13.1167 13.3 13.3C13.1167 13.4833 12.8833 13.575 12.6 13.575C12.3167 13.575 12.0833 13.4833 11.9 13.3L7 8.4Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  language: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.32083 0.7875 6.1125C1.3125 4.90417 2.02917 3.84583 2.9375 2.9375C3.84583 2.02917 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6792 0.2625 13.8875 0.7875C15.0958 1.3125 16.1542 2.02917 17.0625 2.9375C17.9708 3.84583 18.6875 4.90417 19.2125 6.1125C19.7375 7.32083 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.9708 16.1542 17.0625 17.0625C16.1542 17.9708 15.0958 18.6875 13.8875 19.2125C12.6792 19.7375 11.3833 20 10 20ZM10 17.95C10.4333 17.35 10.8083 16.725 11.125 16.075C11.4417 15.425 11.7 14.7333 11.9 14H8.1C8.3 14.7333 8.55833 15.425 8.875 16.075C9.19167 16.725 9.56667 17.35 10 17.95ZM7.4 17.55C7.1 17 6.8375 16.4292 6.6125 15.8375C6.3875 15.2458 6.2 14.6333 6.05 14H3.1C3.58333 14.8333 4.1875 15.5583 4.9125 16.175C5.6375 16.7917 6.46667 17.25 7.4 17.55ZM12.6 17.55C13.5333 17.25 14.3625 16.7917 15.0875 16.175C15.8125 15.5583 16.4167 14.8333 16.9 14H13.95C13.8 14.6333 13.6125 15.2458 13.3875 15.8375C13.1625 16.4292 12.9 17 12.6 17.55ZM2.25 12H5.65C5.6 11.6667 5.5625 11.3375 5.5375 11.0125C5.5125 10.6875 5.5 10.35 5.5 10C5.5 9.65 5.5125 9.3125 5.5375 8.9875C5.5625 8.6625 5.6 8.33333 5.65 8H2.25C2.16667 8.33333 2.10417 8.6625 2.0625 8.9875C2.02083 9.3125 2 9.65 2 10C2 10.35 2.02083 10.6875 2.0625 11.0125C2.10417 11.3375 2.16667 11.6667 2.25 12ZM7.65 12H12.35C12.4 11.6667 12.4375 11.3375 12.4625 11.0125C12.4875 10.6875 12.5 10.35 12.5 10C12.5 9.65 12.4875 9.3125 12.4625 8.9875C12.4375 8.6625 12.4 8.33333 12.35 8H7.65C7.6 8.33333 7.5625 8.6625 7.5375 8.9875C7.5125 9.3125 7.5 9.65 7.5 10C7.5 10.35 7.5125 10.6875 7.5375 11.0125C7.5625 11.3375 7.6 11.6667 7.65 12ZM14.35 12H17.75C17.8333 11.6667 17.8958 11.3375 17.9375 11.0125C17.9792 10.6875 18 10.35 18 10C18 9.65 17.9792 9.3125 17.9375 8.9875C17.8958 8.6625 17.8333 8.33333 17.75 8H14.35C14.4 8.33333 14.4375 8.6625 14.4625 8.9875C14.4875 9.3125 14.5 9.65 14.5 10C14.5 10.35 14.4875 10.6875 14.4625 11.0125C14.4375 11.3375 14.4 11.6667 14.35 12ZM13.95 6H16.9C16.4167 5.16667 15.8125 4.44167 15.0875 3.825C14.3625 3.20833 13.5333 2.75 12.6 2.45C12.9 3 13.1625 3.57083 13.3875 4.1625C13.6125 4.75417 13.8 5.36667 13.95 6ZM8.1 6H11.9C11.7 5.26667 11.4417 4.575 11.125 3.925C10.8083 3.275 10.4333 2.65 10 2.05C9.56667 2.65 9.19167 3.275 8.875 3.925C8.55833 4.575 8.3 5.26667 8.1 6ZM3.1 6H6.05C6.2 5.36667 6.3875 4.75417 6.6125 4.1625C6.8375 3.57083 7.1 3 7.4 2.45C6.46667 2.75 5.6375 3.20833 4.9125 3.825C4.1875 4.44167 3.58333 5.16667 3.1 6Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M6.71249 13.2125C4.89583 13.2125 3.35833 12.5833 2.09999 11.325C0.841661 10.0667 0.212494 8.52917 0.212494 6.7125C0.212494 4.89583 0.841661 3.35834 2.09999 2.1C3.35833 0.841668 4.89583 0.212502 6.71249 0.212502C8.52916 0.212502 10.0667 0.841668 11.325 2.1C12.5833 3.35834 13.2125 4.89583 13.2125 6.7125C13.2125 7.44584 13.0958 8.1375 12.8625 8.7875C12.6292 9.4375 12.3125 10.0125 11.9125 10.5125L17.5125 16.1125C17.6958 16.2958 17.7875 16.5292 17.7875 16.8125C17.7875 17.0958 17.6958 17.3292 17.5125 17.5125C17.3292 17.6958 17.0958 17.7875 16.8125 17.7875C16.5292 17.7875 16.2958 17.6958 16.1125 17.5125L10.5125 11.9125C10.0125 12.3125 9.43749 12.6292 8.78749 12.8625C8.13749 13.0958 7.44583 13.2125 6.71249 13.2125ZM6.71249 11.2125C7.96249 11.2125 9.02499 10.775 9.89999 9.9C10.775 9.025 11.2125 7.9625 11.2125 6.7125C11.2125 5.4625 10.775 4.4 9.89999 3.525C9.02499 2.65 7.96249 2.2125 6.71249 2.2125C5.46249 2.2125 4.39999 2.65 3.52499 3.525C2.64999 4.4 2.21249 5.4625 2.21249 6.7125C2.21249 7.9625 2.64999 9.025 3.52499 9.9C4.39999 10.775 5.46249 11.2125 6.71249 11.2125Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
  <path d="M1 12C0.716667 12 0.479167 11.9042 0.2875 11.7125C0.0958333 11.5208 0 11.2833 0 11C0 10.7167 0.0958333 10.4792 0.2875 10.2875C0.479167 10.0958 0.716667 10 1 10H17C17.2833 10 17.5208 10.0958 17.7125 10.2875C17.9042 10.4792 18 10.7167 18 11C18 11.2833 17.9042 11.5208 17.7125 11.7125C17.5208 11.9042 17.2833 12 17 12H1ZM1 7C0.716667 7 0.479167 6.90417 0.2875 6.7125C0.0958333 6.52083 0 6.28333 0 6C0 5.71667 0.0958333 5.47917 0.2875 5.2875C0.479167 5.09583 0.716667 5 1 5H17C17.2833 5 17.5208 5.09583 17.7125 5.2875C17.9042 5.47917 18 5.71667 18 6C18 6.28333 17.9042 6.52083 17.7125 6.7125C17.5208 6.90417 17.2833 7 17 7H1ZM1 2C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H1Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  visibility: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
  <path d="M11 12.5C12.25 12.5 13.3125 12.0625 14.1875 11.1875C15.0625 10.3125 15.5 9.25 15.5 8C15.5 6.75 15.0625 5.6875 14.1875 4.8125C13.3125 3.9375 12.25 3.5 11 3.5C9.75 3.5 8.6875 3.9375 7.8125 4.8125C6.9375 5.6875 6.5 6.75 6.5 8C6.5 9.25 6.9375 10.3125 7.8125 11.1875C8.6875 12.0625 9.75 12.5 11 12.5ZM11 10.7C10.25 10.7 9.6125 10.4375 9.0875 9.9125C8.5625 9.3875 8.3 8.75 8.3 8C8.3 7.25 8.5625 6.6125 9.0875 6.0875C9.6125 5.5625 10.25 5.3 11 5.3C11.75 5.3 12.3875 5.5625 12.9125 6.0875C13.4375 6.6125 13.7 7.25 13.7 8C13.7 8.75 13.4375 9.3875 12.9125 9.9125C12.3875 10.4375 11.75 10.7 11 10.7ZM11 15.5C8.56667 15.5 6.35 14.8208 4.35 13.4625C2.35 12.1042 0.9 10.2833 0 8C0.9 5.71667 2.35 3.89583 4.35 2.5375C6.35 1.17917 8.56667 0.5 11 0.5C13.4333 0.5 15.65 1.17917 17.65 2.5375C19.65 3.89583 21.1 5.71667 22 8C21.1 10.2833 19.65 12.1042 17.65 13.4625C15.65 14.8208 13.4333 15.5 11 15.5ZM11 13.5C12.8833 13.5 14.6125 13.0042 16.1875 12.0125C17.7625 11.0208 18.9667 9.68333 19.8 8C18.9667 6.31667 17.7625 4.97917 16.1875 3.9875C14.6125 2.99583 12.8833 2.5 11 2.5C9.11667 2.5 7.3875 2.99583 5.8125 3.9875C4.2375 4.97917 3.03333 6.31667 2.2 8C3.03333 9.68333 4.2375 11.0208 5.8125 12.0125C7.3875 13.0042 9.11667 13.5 11 13.5Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "visibility-off": `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
  <path d="M15.1 10.6L13.65 9.15C13.8 8.36667 13.575 7.63333 12.975 6.95C12.375 6.26667 11.6 6 10.65 6.15L9.2 4.7C9.48333 4.56667 9.77083 4.46667 10.0625 4.4C10.3542 4.33333 10.6667 4.3 11 4.3C12.25 4.3 13.3125 4.7375 14.1875 5.6125C15.0625 6.4875 15.5 7.55 15.5 8.8C15.5 9.13333 15.4667 9.44583 15.4 9.7375C15.3333 10.0292 15.2333 10.3167 15.1 10.6ZM18.3 13.75L16.85 12.35C17.4833 11.8667 18.0458 11.3375 18.5375 10.7625C19.0292 10.1875 19.45 9.53333 19.8 8.8C18.9667 7.11667 17.7708 5.77917 16.2125 4.7875C14.6542 3.79583 12.9167 3.3 11 3.3C10.5167 3.3 10.0417 3.33333 9.575 3.4C9.10833 3.46667 8.65 3.56667 8.2 3.7L6.65 2.15C7.33333 1.86667 8.03333 1.65417 8.75 1.5125C9.46667 1.37083 10.2167 1.3 11 1.3C13.5167 1.3 15.7583 1.99583 17.725 3.3875C19.6917 4.77917 21.1167 6.58333 22 8.8C21.6167 9.78333 21.1125 10.6958 20.4875 11.5375C19.8625 12.3792 19.1333 13.1167 18.3 13.75ZM18.8 19.9L14.6 15.75C14.0167 15.9333 13.4292 16.0708 12.8375 16.1625C12.2458 16.2542 11.6333 16.3 11 16.3C8.48333 16.3 6.24167 15.6042 4.275 14.2125C2.30833 12.8208 0.883333 11.0167 0 8.8C0.35 7.91667 0.791667 7.09583 1.325 6.3375C1.85833 5.57917 2.46667 4.9 3.15 4.3L0.4 1.5L1.8 0.0999985L20.2 18.5L18.8 19.9ZM4.55 5.7C4.06667 6.13333 3.625 6.60833 3.225 7.125C2.825 7.64167 2.48333 8.2 2.2 8.8C3.03333 10.4833 4.22917 11.8208 5.7875 12.8125C7.34583 13.8042 9.08333 14.3 11 14.3C11.3333 14.3 11.6583 14.2792 11.975 14.2375C12.2917 14.1958 12.6167 14.15 12.95 14.1L12.05 13.15C11.8667 13.2 11.6917 13.2375 11.525 13.2625C11.3583 13.2875 11.1833 13.3 11 13.3C9.75 13.3 8.6875 12.8625 7.8125 11.9875C6.9375 11.1125 6.5 10.05 6.5 8.8C6.5 8.61667 6.5125 8.44167 6.5375 8.275C6.5625 8.10833 6.6 7.93333 6.65 7.75L4.55 5.7Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  "account-circle": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M3.85 15.1C4.7 14.45 5.65 13.9375 6.7 13.5625C7.75 13.1875 8.85 13 10 13C11.15 13 12.25 13.1875 13.3 13.5625C14.35 13.9375 15.3 14.45 16.15 15.1C16.7333 14.4167 17.1875 13.6417 17.5125 12.775C17.8375 11.9083 18 10.9833 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 10.9833 2.1625 11.9083 2.4875 12.775C2.8125 13.6417 3.26667 14.4167 3.85 15.1ZM10 11C9.01667 11 8.1875 10.6625 7.5125 9.9875C6.8375 9.3125 6.5 8.48333 6.5 7.5C6.5 6.51667 6.8375 5.6875 7.5125 5.0125C8.1875 4.3375 9.01667 4 10 4C10.9833 4 11.8125 4.3375 12.4875 5.0125C13.1625 5.6875 13.5 6.51667 13.5 7.5C13.5 8.48333 13.1625 9.3125 12.4875 9.9875C11.8125 10.6625 10.9833 11 10 11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  help: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9.95 16C10.3 16 10.5958 15.8792 10.8375 15.6375C11.0792 15.3958 11.2 15.1 11.2 14.75C11.2 14.4 11.0792 14.1042 10.8375 13.8625C10.5958 13.6208 10.3 13.5 9.95 13.5C9.6 13.5 9.30417 13.6208 9.0625 13.8625C8.82083 14.1042 8.7 14.4 8.7 14.75C8.7 15.1 8.82083 15.3958 9.0625 15.6375C9.30417 15.8792 9.6 16 9.95 16ZM9.05 12.15H10.9C10.9 11.6 10.9625 11.1667 11.0875 10.85C11.2125 10.5333 11.5667 10.1 12.15 9.55C12.5833 9.11667 12.925 8.70417 13.175 8.3125C13.425 7.92083 13.55 7.45 13.55 6.9C13.55 5.96667 13.2083 5.25 12.525 4.75C11.8417 4.25 11.0333 4 10.1 4C9.15 4 8.37917 4.25 7.7875 4.75C7.19583 5.25 6.78333 5.85 6.55 6.55L8.2 7.2C8.28333 6.9 8.47083 6.575 8.7625 6.225C9.05417 5.875 9.5 5.7 10.1 5.7C10.6333 5.7 11.0333 5.84583 11.3 6.1375C11.5667 6.42917 11.7 6.75 11.7 7.1C11.7 7.43333 11.6 7.74583 11.4 8.0375C11.2 8.32917 10.95 8.6 10.65 8.85C9.91667 9.5 9.46667 9.99167 9.3 10.325C9.13333 10.6583 9.05 11.2667 9.05 12.15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="var(--nys-icon-color, currentcolor)"/>
</svg>`,
  share: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
  <path d="M15 20C14.1667 20 13.4583 19.7083 12.875 19.125C12.2917 18.5417 12 17.8333 12 17C12 16.9 12.025 16.6667 12.075 16.3L5.05 12.2C4.78333 12.45 4.475 12.6458 4.125 12.7875C3.775 12.9292 3.4 13 3 13C2.16667 13 1.45833 12.7083 0.875 12.125C0.291667 11.5417 0 10.8333 0 10C0 9.16667 0.291667 8.45833 0.875 7.875C1.45833 7.29167 2.16667 7 3 7C3.4 7 3.775 7.07083 4.125 7.2125C4.475 7.35417 4.78333 7.55 5.05 7.8L12.075 3.7C12.0417 3.58333 12.0208 3.47083 12.0125 3.3625C12.0042 3.25417 12 3.13333 12 3C12 2.16667 12.2917 1.45833 12.875 0.875C13.4583 0.291667 14.1667 0 15 0C15.8333 0 16.5417 0.291667 17.125 0.875C17.7083 1.45833 18 2.16667 18 3C18 3.83333 17.7083 4.54167 17.125 5.125C16.5417 5.70833 15.8333 6 15 6C14.6 6 14.225 5.92917 13.875 5.7875C13.525 5.64583 13.2167 5.45 12.95 5.2L5.925 9.3C5.95833 9.41667 5.97917 9.52917 5.9875 9.6375C5.99583 9.74583 6 9.86667 6 10C6 10.1333 5.99583 10.2542 5.9875 10.3625C5.97917 10.4708 5.95833 10.5833 5.925 10.7L12.95 14.8C13.2167 14.55 13.525 14.3542 13.875 14.2125C14.225 14.0708 14.6 14 15 14C15.8333 14 16.5417 14.2917 17.125 14.875C17.7083 15.4583 18 16.1667 18 17C18 17.8333 17.7083 18.5417 17.125 19.125C16.5417 19.7083 15.8333 20 15 20ZM15 18C15.2833 18 15.5208 17.9042 15.7125 17.7125C15.9042 17.5208 16 17.2833 16 17C16 16.7167 15.9042 16.4792 15.7125 16.2875C15.5208 16.0958 15.2833 16 15 16C14.7167 16 14.4792 16.0958 14.2875 16.2875C14.0958 16.4792 14 16.7167 14 17C14 17.2833 14.0958 17.5208 14.2875 17.7125C14.4792 17.9042 14.7167 18 15 18ZM3 11C3.28333 11 3.52083 10.9042 3.7125 10.7125C3.90417 10.5208 4 10.2833 4 10C4 9.71667 3.90417 9.47917 3.7125 9.2875C3.52083 9.09583 3.28333 9 3 9C2.71667 9 2.47917 9.09583 2.2875 9.2875C2.09583 9.47917 2 9.71667 2 10C2 10.2833 2.09583 10.5208 2.2875 10.7125C2.47917 10.9042 2.71667 11 3 11ZM15 4C15.2833 4 15.5208 3.90417 15.7125 3.7125C15.9042 3.52083 16 3.28333 16 3C16 2.71667 15.9042 2.47917 15.7125 2.2875C15.5208 2.09583 15.2833 2 15 2C14.7167 2 14.4792 2.09583 14.2875 2.2875C14.0958 2.47917 14 2.71667 14 3C14 3.28333 14.0958 3.52083 14.2875 3.7125C14.4792 3.90417 14.7167 4 15 4Z" fill="#1C1B1F"/>
</svg>`,
};

export default iconLibrary;
