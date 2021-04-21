import { LitElement, html, css } from 'lit-element';
import { registerTranslateConfig, use, translate } from "lit-translate";
import { fetchDatingApps, fetchMailTo } from './personaldata-io.js';


const DEFAULT_TRANSLATIONS = {
    "body": "Body",
    "subject": "Subject",
    "dating_app": "Dating app",
    "select_placeholder": "Click to choose",
    "email_button": "Open in your email client",
    "body_placeholder": "Choose an app to fill this automatically",
    "recipient": "Recipient",
    "search_placeholder": "Search",
    "copy_button": "Copy to clipboard",
    "to_fill_in": "The following information needs to be filled in by hand in the email:"

};

// is this really the place to do this?
registerTranslateConfig({
    loader: async (lang) => {
        try{
            const result = await fetch(`/assets/i18n/sar-form.json`);
            const translations = await result.json();
            return translations[lang] || DEFAULT_TRANSLATIONS;
        }catch(error){
           return  DEFAULT_TRANSLATIONS;
        }
    }});

function compareItemLabel(appA, appB) {
    const nameA = appA.itemLabel.toUpperCase();
    const nameB = appB.itemLabel.toUpperCase();
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
}

const IDS = {
    select: 'dating-app-select',
    body: 'email-body',
    recipient: 'email-recipient',
    subject: 'email-subject',
    partsToFillIn: 'email-parts-to-fill-in'
};

export class SubjectAccessRequestForm extends LitElement {

    static get styles() {
        return css`
          .inline{ display: inline-block; }
     `;
    }

    static get properties() {
        return {
            lang: { type: String },
            apps: { type: Array, attribute: false },
            search: { type: String, attribute: false },
            recipient: { type: String, attribute: false },
            subject: { type: String, attribute: false },
            body: { type: String, attribute: false },
            partsToFillIn: { type: Array, attribute: false }
        }
    }

    constructor() {
        super();
        this.apps = [];
        this.search = '';
        this.recipient = '';
        this.subject = '';
        this.body = '';
        this.partsToFillIn = [];
        this.i18n = {
            datingApp: 'Dating app',
            selectPlaceholder: 'Click to choose',
            searchPlaceholder: 'search',
            recipient: 'Recipient',
            subject: 'Subject',
            body: 'Body',
            bodyPlaceholder: 'Choose an app to fill this automatically',
            copyButton: 'Copy to clipboard',
            emailButton: 'Open in your email client'
        };

        this.fetchApps();
    }

  firstUpdated() {
    // Load the default language
      use(this.lang);
  }

    async fetchApps() {
        const apps = await fetchDatingApps();
        apps.sort(compareItemLabel);
        this.apps = apps;
    }

    async onSelectApp(event) {
        const select = event.target;
        const option = select.options[select.selectedIndex];
        if(option){
            this.search = '';
            const item = option.dataset.item;
            const mailTo = await fetchMailTo(item, false);
            this.body = mailTo.body;
            this.recipient = mailTo.recipient;
            this.subject = mailTo.subject;
            this.partsToFillIn = mailTo.body.match(/.*<<.*>>/g);
        }
    }

    onSearch(event){
        const search = event.target;
        const select = this.byId(IDS.select);
        const option = select.querySelector(
                `option[value='${search.value}']`);
        if (option) {
            select.value = option.value;
            search.value = "";
            select.dispatchEvent(new Event('change'));
        }
    }

    copyToClipboard(textId) {
        const copyText = this.byId(textId);
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    openEmailClient() {
        const t = this;
        console.log('heee',IDS.subject, t.byId(IDS.subject))
        const email = t.byId(IDS.recipient).value;
        const subject = encodeURIComponent(t.byId(IDS.subject).value);
        const body = encodeURIComponent(t.byId(IDS.body).value);
        const urlString = `mailto:${email}?subject=${subject}&body=${body}`;
        const url = new URL(urlString);
        window.location.href = url.href;
    }

    render() {
        const t = this;
        return html`
          <div class="inline">
            <label for="${IDS.select}">${translate("dating_app")}</label>
            <select id="${IDS.select}" @change="${t.onSelectApp}">
               <option disabled selected value> ${translate("select_placeholder")} </option>
              ${t.apps.map(app =>
               html`<option data-item="${app.item}"
                             value="${app.itemLabel}">
                        ${app.itemLabel}</option>`)}
            </select>
          </div>
          <div class="inline">
            <input placeholder="${translate("search_placeholder")}"
                   list="search-list"
                   value="${t.search}"
                   @input="${t.onSearch}">
            <datalist  id="search-list">
              ${t.apps.map(app =>
                   html`<option value="${app.itemLabel}"></option>`)}
            </datalist>
          </div>
          <div>
            <label for="${IDS.recipient}">${translate("recipient")}</label>
            <input id="${IDS.recipient}" value="${t.recipient}">
            <button @click="${_ => t.copyToClipboard(IDS.recipient)}">
               ${translate("copy_button")}
             </button>
          </div>
          <div>
            <label for="${IDS.subject}">${translate("subject")}</label>
            <input id="${IDS.subject}" value="${t.subject}">
            <button @click="${_ => t.copyToClipboard(IDS.subject)}">
               ${translate("copy_button")}
             </button>
          </div>
        ${!this.partsToFillIn.length ? '' : html`
          <div>
            <div>${translate("to_fill_in")}</div>
            <ul>
               ${this.partsToFillIn.map(p =>
                   html`<li>${p}</li>`)}
            </ul>
          </div>`
         }

          <div>
            <label for="${IDS.body}">${translate("body")}</label>
            <textarea placeholder="${translate("body_placeholder")}"
                      id="${IDS.body}">${t.body}</textarea>
            <button @click="${_ => t.copyToClipboard(IDS.body)}">
               ${translate("copy_button")}
            </button>
          </div>
          <div>
            <button @click="${t.openEmailClient}">
               ${translate("email_button")}
            </button>
          </div>
     `;
    }

    byId(id) {
        return this.shadowRoot.querySelector('#' + id);
    }
}

customElements.define('sar-form', SubjectAccessRequestForm);
