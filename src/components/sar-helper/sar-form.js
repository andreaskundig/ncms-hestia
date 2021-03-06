import { LitElement, html, css, svg } from 'lit-element';
import { registerTranslateConfig, use, translate } from "lit-translate";
import { fetchDatingApps, fetchMailTo } from './personaldata-io.js';

const DEFAULT_TRANSLATIONS = {
    "subject": "Subject",
    "dating_app": "Dating app",
    "select_placeholder": "Click to choose",
    "email_button": "Open in your e-mail client",
    "body_placeholder": "Choose an app to fill this automatically",
    "recipient": "Recipient",
    "search_placeholder": "Search",
    "copy_button": "Copy to clipboard",
    "preview_of_email": "Preview of the e-mail",
    "preview_of_email_to": "Preview of the e-mail to",
    "explanation": "You can copy the e-mail fields or open it directly in your e-mail client",
    "to_fill_in": "The following information needs to be filled in by hand in the e-mail body:"
};

const IDS = {
    search: 'dating-app-search',
    body: 'email-body',
    recipient: 'email-recipient',
    subject: 'email-subject',
    partsToFillIn: 'email-parts-to-fill-in'
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

const unCamelCase = (string) => string.replace(/([a-z])([A-Z][a-z])/g, '$1 $2');

export class SubjectAccessRequestForm extends LitElement {

    static get styles() {
      return css`
        @import '/assets/styles/vendor/normalize.css';
        @import '/assets/styles/base/typography.css';
        @import '/assets/styles/base/spacing.css';
        @import '/assets/styles/elements/buttons.css';
        @import '/assets/styles/elements/forms.css';

        :host {
          display: block; }

        .app-selection {
          display:flex;
          margin-bottom: 0.5rem; }

        .app-selection > label {
          width: 20%; }

        .app-selection > input {
          flex-grow: 1; }

        .email-field {
          display:flex;
          margin-bottom: 0.5rem; }

        .email-field > label {
          width: 20%; }

        .email-field > input {
          flex-grow: 1; }

        .copyIcon {
          cursor: pointer;
          margin-left: 0.5rem; }

        .copyIconSpacer {
          /* same width as the SVG ‹Copy› icon (returned by getCopyIcon() function),
             plus the margin/padding defined by the above 'copyIcon' class */
          min-width: calc( 0.5rem + 24px);
        }

        .email-body{
          display: flex }

        .email-body > textarea {
          flex-grow: 1;
          height: 20em;
          margin-bottom: 1rem; }
      `;
    }

    static get properties() {
        return {
            lang: { type: String },
            apps: { type: Array, attribute: false },
            selectedApp: { type: Object, attribute: false },
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
        this.selectedApp = undefined;
        this.search = '';
        this.recipient = '';
        this.subject = '';
        this.body = '';
        this.partsToFillIn = [];

        this.fetchApps();
    }

    firstUpdated() {
        // Load the default language
        use(this.lang);
    }

    async fetchApps() {
        const fetched = await fetchDatingApps();
        const apps = fetched.map(app =>
            Object.assign(app,
                { displayName: unCamelCase(app.itemLabel) }))
            .sort(compareItemLabel);
        this.apps = apps;
    }

    async displayEmail(item) {
        if(item){
            const mailTo = await fetchMailTo(item, false);
            this.body = mailTo.body;
            this.recipient = mailTo.recipient;
            this.subject = mailTo.subject;
            this.partsToFillIn = mailTo.body.match(/.*<<.*>>/g);
        }
    }

    findAppByDisplayName(searchString, exactMatch) {
        const found = this.apps.filter(app => {
            const name = app.displayName.toLowerCase();
            const search = searchString.toLowerCase();
            if (exactMatch) {
                return name === search;
            }
            return name.includes(search);
        });
        return found.length === 1 ? found[0] : undefined;
    }

    onSearch(event){
        const search = event.target;
        const app = this.findAppByDisplayName(search.value, true);
        if (app) {
            this.selectApp(app);
        }
    }

    async selectApp(app){
        this.selectedApp = app;
        console.log('s', this.selectedApp)
        const search = this.byId(IDS.search);
        search.value = app.displayName;
        await this.displayEmail(app.item);
    }

    onSearchType(event){
        if(event.key === 'Enter'){
            const search = event.target;
            const app = this.findAppByDisplayName(search.value);
            if (app) {
                this.selectApp(app);
            }
        }
    }

    copyToClipboard(textId) {
        const copyText = this.byId(textId);
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    openEmailClient() {
        const email = this.byId(IDS.recipient).value;
        const subject = encodeURIComponent(this.byId(IDS.subject).value);
        const body = encodeURIComponent(this.byId(IDS.body).value);
        const urlString = `mailto:${email}?subject=${subject}&body=${body}`;
        const url = new URL(urlString);
        window.location.href = url.href;
    }

    getCopyIcon(){
       return svg`<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>`
    }

    render() {
        const that = this;
        return html`
          <div class="app-selection"">
            <label for="${IDS.search}">${translate("dating_app")}</label>
            <input placeholder="${translate("search_placeholder")}"
                   list="search-list"
                   id="${IDS.search}"
                   @keyup="${that.onSearchType}"
                   @input="${that.onSearch}">
            <datalist  id="search-list">
              ${this.apps.map(app =>
                html`<option>${app.displayName}</option>`)}
            </datalist>
            <span class="copyIconSpacer">&nbsp;</span>
          </div>
          <h2>${this.selectedApp
            ? html`${translate('preview_of_email_to')}
                <strong>${this.selectedApp.displayName}</strong>`
            : translate('preview_of_email')
          }</h2>
          <p>${translate('explanation')}</p>
          ${!this.partsToFillIn.length ? '' : html`
          <div class="parts-to-fill-in">
            <p>${translate("to_fill_in")}</p>
            <ul>
              ${this.partsToFillIn.map(p => html`<li>${p}</li>`)}
            </ul>
          </div>`}
          <div class="email-field">
            <label for="${IDS.recipient}">${translate("recipient")}</label>
            <input id="${IDS.recipient}" type="email" value="${this.recipient}">
            <span class="copyIcon" title="${translate("copy_button")}"
                  @click="${_ => that.copyToClipboard(IDS.recipient)}">
              ${this.getCopyIcon()}
            </span>
          </div>
          <div class="email-field">
            <label for="${IDS.subject}">${translate("subject")}</label>
            <input id="${IDS.subject}" type="text" value="${this.subject}">
            <span class="copyIcon" title="${translate("copy_button")}"
                  @click="${_ => that.copyToClipboard(IDS.subject)}">
               ${this.getCopyIcon()}
             </span>
          </div>
          <div class="email-body">
            <textarea placeholder="${translate("body_placeholder")}"
                      id="${IDS.body}">${this.body}</textarea>
            <span class="copyIcon" title="${translate("copy_button")}"
                  @click="${_ => that.copyToClipboard(IDS.body)}">
               ${this.getCopyIcon()}
            </span>
          </div>
          <button @click="${this.openEmailClient}">
            ${translate("email_button")}
          </button>
     `;
    }

    byId(id) {
        return this.shadowRoot.querySelector('#' + id);
    }
}

customElements.define('sar-form', SubjectAccessRequestForm);
