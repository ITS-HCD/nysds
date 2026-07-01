import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-nygovid.scss?inline";


let componentIdCounter = 0;

/**
 * `<nys-your-component-name>` is ...
 */



/**
 * Lifecycle methods
 * --------------------------------------------------------------------------
 */



/**
 * Functions
 * --------------------------------------------------------------------------
 */

// Placeholder for generic functions (component-specific)

/**
 * Event Handlers
 * --------------------------------------------------------------------------
 */

// Placeholder for event handlers if needed

_render() {
  if (!this.shadowRoot) return;

  this.shadowRoot.innerHTML = `
        <style>
          @import url("${NYSDS_CSS}");

          :host {
            display: block;
            font-family: var(--nys-font-family-body, 'Public Sans', sans-serif);
          }

          .login-card {
            background-color: var(--nys-color-surface, #ffffff);
            padding: var(--nys-space-200, 2.5rem);
            border: var(--nys-border-width-sm, 1px) solid var(--nys-color-base, #797C7F);
            width: 100%;
            max-width: 400px;
            box-sizing: border-box;
            margin: 0 auto;
            border-radius: var(--nys-radius-sm, 4px);
            color: var(--nys-color-text, #1B1B1B);
            box-shadow: var(--nys-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
            text-align: center;
          }

          .logo-container {
            margin-bottom: var(--nys-space-600, 1.5rem);
            display: flex;
            justify-content: center;
          }

          .logo-container img {
            max-width: 240px;
            height: auto;
          }

          #signin-btn {
            margin-bottom: var(--nys-space-200);
          }

          .divider-container {
             margin-top: var(--nys-space-200);
             margin-bottom: var(--nys-space-200);
          }

          .create-account-section {
            text-align: left;
            margin-top: var(--nys-space-200);
          }

          .create-account-text {
            font-size: var(--nys-font-size-body-sm);
            color: var(--nys-color-text-weak);
            margin-bottom: var(--nys-space-100);
            font-weight: var(--nys-font-weight-regular);
          }

          /* Mobile adjustments */
          @media (max-width: 480px) {
            .login-card {
              border: none;
              box-shadow: none;
              padding: var(--nys-space-200);
              max-width: 100%;
            }
          }
        </style>

        <div class="login-card">
          <div class="logo-container">
            <img src="nygovid-logo.svg" alt="NY.gov ID Logo" width="240" height="60">
          </div>

          <nys-button 
            id="signin-btn" 
            label="SIGN IN" 
            variant="filled"
            fullWidth 
            size="md"  
            href="${this.signin}">
          </nys-button>
          
          <nys-button 
            id="find-btn" 
            label="FIND MY ACCOUNT" 
            variant="outline" 
            fullWidth
            size="md"
            href="${this.find}">
          </nys-button>

          

          <div class="divider-container">
            <nys-divider></nys-divider>
          </div>

          <div class="create-account-section">
            <div class="create-account-text">First time using NY.GOV ID?</div>
            <nys-button
              id="create-btn" 
              variant="text"
              label="Create Account" 
              size="md"
              href="${this.create}">
            </nys-button>
          </div>
        </div>
      `;
}

if (!customElements.get("nys-nygovid")) {
  customElements.define("nys-nygovid", NysNygovid);
}
