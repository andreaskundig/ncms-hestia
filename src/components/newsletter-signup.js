import { LitElement, html, css } from 'lit-element';
import { registerTranslateConfig, use, translate } from "lit-translate";

const DEFAULT_TRANSLATIONS = {
    "title": "Sign up to our newsletter",
    "info": "",
    "first_name": "First name",
    "last_name": "Last name",
    "email": "Email address",
    "info": "We won't really spam you",
    "submit_button": "Send"
};

registerTranslateConfig({
    loader: async (lang) => {
        try{
            const result = await fetch(`/assets/i18n/newsletter-signup.json`);
            const translations = await result.json();
            return translations[lang] || DEFAULT_TRANSLATIONS;
        }catch(error){
           return  DEFAULT_TRANSLATIONS;
        }
    }});

export class NewsletterSignup extends LitElement {

  static get styles() {
    return css`
        @import '/assets/styles/vendor/normalize.css';
        @import '/assets/styles/base/typography.css';
        @import '/assets/styles/elements/buttons.css';

        .signup-fields {
            display: flex;
        }
        .signup-field{
            flex: 1;
            min-width: 48%;
            padding-left: 0.75rem;
            padding-bottom: 0.75rem;
        }
        .signup-field:first-child{
            padding-left: 0;
        }
        .signup-field input{
            display: block;
            width: 100%;
        }
    `;
  }
    static get properties() {
        return {
            lang: { type: String },
            netlifyName: { type: String }
        }
    }

  constructor() {
    super();
  }

  firstUpdated() {
    // Load the default language
      use(this.lang);
  }

  render() {
    // https://docs.netlify.com/forms/setup/#work-with-javascript-rendered-forms
    return html`
    <form name="${this.netlifyName}" class="signup"
          method="POST" data-netlify="true">
      <input type="hidden" name="form-name"
             value="${this.netlifyName}" />
      <input type="hidden" name="lang"
             value="${this.lang}" />
      <div >
        <h1>${translate("title")}</h1>
        ${!translate("info") ? '' :
            html`<p>${translate("info")}</p>`
         }
      </div>
      <div class="signup-fields">
        <div class="signup-field">
          <label for="signup-first-name">
            ${translate("first_name")}
          </label>
          <input type="text" name="first-name"
                id="signup-first-name">
        </div>
        <div class="signup-field">
          <label for="signup-last-name">
            ${translate("last_name")}
          </label>
          <input type="text" name="last-name"
                id="signup-last-name">
        </div>
      </div>
      <div class="signup-fields">
        <div class="signup-field">
          <label for="signup-email">
            ${translate("email")}
          </label>
          <input type="email" name="email"
                id="signup-email">
        </div>
      </div>
      <div>
        <button type="submit">${translate("submit_button")}</button>
      </div>
    </form>
    `;
  }

}

customElements.define('newsletter-signup', NewsletterSignup);
