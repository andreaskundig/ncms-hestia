import { LitElement, html, css } from 'lit-element';
import { registerTranslateConfig, use, translate } from "lit-translate";

const DEFAULT_TRANSLATIONS = {
    "title": "Something else?",
    "subject": "Subject",
    "first_name": "First name",
    "last_name": "Last name",
    "email": "Email address",
    "message": "Type your message here",
    "submit_button": "Send"
};

registerTranslateConfig({
    loader: async (lang) => {
        try{
            const result = await fetch(`/assets/i18n/contact-form.json`);
            const translations = await result.json();
            return translations[lang] || DEFAULT_TRANSLATIONS;
        }catch(error){
           return  DEFAULT_TRANSLATIONS;
        }
    }});

/**
 * ‹contact-form› custom element, displaying a
 * form to send a message.
 *
 * Submitted values will be sent to and stored into the
 * Netlify Forms service.
 *
 * Note:
 *
 *   Netlify buildbots find the forms by parsing the
 *   static HTML of the site when the build completes; as
 *   this Web Component renders the form client-side, the
 *   buildbots won't find the form.
 *   To work around this, a hidden form needs to be added
 *   to the static HTML, somewhere outside of this Web Component,
 *   with the same form structure as the one rendered hereafter.
 *
 * See also:
 *   Netlify Docs › Forms setup › JavaScript forms
 *   https://docs.netlify.com/forms/setup/#work-with-javascript-rendered-forms
 *
 * Attributes:
 *
 *   lang: String
 *    The language of the page on which the component is displayed.
 *
 *   netlifyFormName: String
 *    The name of the netlify form.
 *
 *
 * Usage:
 *
 *     <form name="{{netlifyFormName}}" method="POST" data-netlify="true">
 *           <input type="hidden" name="first-name">
 *           <input type="hidden" name="last-name">
 *           <input type="hidden" name="email">
 *           <input type="hidden" name="subject">
 *           <input type="hidden" name="message">
 *           <input type="hidden" name="lang" />
 *     </form>
 *     <contact-form lang="{{locale}}"
 *                        netlifyFormName="{{netlifyFormName}}"/>
 *
 */
export class ContactForm extends LitElement {

  static get styles() {
    return css`
        @import '/assets/styles/vendor/normalize.css';
        @import '/assets/styles/base/typography.css';
        @import '/assets/styles/elements/buttons.css';

        .fields {
            display: flex;
        }
        .field{
            flex: 1;
            min-width: 48%;
            padding-left: 0.75rem;
            padding-bottom: 0.75rem;
        }
        .field:first-child{
            padding-left: 0;
        }
        .field input, .field textarea{
            display: block;
            width: 100%;
        }
        .field textarea{
            height: 10em;
        }

        input[type=text],
        input[type=email],
        textarea {
          padding: 0 0.25rem; }
    `;
  }
    static get properties() {
        return {
            lang: { type: String },
            netlifyFormName: { type: String }
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
    return html`
    <form class="signup" method="POST">
      <h4>${translate('title')}</h4>
      <input type="hidden" name="form-name" value="${this.netlifyFormName}" />
      <input type="hidden" name="lang" value="${this.lang}" />
      <div class="fields">
        <div class="field">
          <label for="first-name"> ${translate("first_name")} </label>
          <input type="text" name="first-name" id="first-name"
                 placeholder="${translate("first_name")}">
        </div>
        <div class="field">
          <label for="last-name"> ${translate("last_name")} </label>
          <input type="text" name="last-name" id="last-name"
                 placeholder="${translate("last_name")}">
        </div>
      </div>
      <div class="fields">
        <div class="field">
          <label for="email"> ${translate("email")} </label>
          <input type="email" name="email" id="email"
                 placeholder="${translate("email")}">
        </div>
      </div>
      <div class="fields">
        <div class="field">
          <label for="subject"> ${translate("subject")} </label>
          <input type="text" name="subject" id="subject"
                 placeholder="${translate("subject")}">
        </div>
      </div>
      <div class="fields">
        <div class="field">
          <label for="message"> ${translate("message")} </label>
          <textarea placeholder="${translate("message")}"
                    name="message" id="message" >
          </textarea>
        </div>
      </div>
      <div>
        <button type="submit">${translate("submit_button")}</button>
      </div>
    </form>
    `;
  }

}

customElements.define('contact-form', ContactForm);