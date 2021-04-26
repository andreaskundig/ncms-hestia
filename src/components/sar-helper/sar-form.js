import { LitElement, html, css, svg } from 'lit-element';
import { registerTranslateConfig, use, translate } from "lit-translate";
import { fetchDatingApps, fetchMailTo } from './personaldata-io.js';


const DEFAULT_TRANSLATIONS = {
    "subject": "Subject",
    "dating_app": "Dating app",
    "select_placeholder": "Click to choose",
    "email_button": "Open in your email client",
    "body_placeholder": "Choose an app to fill this automatically",
    "recipient": "Recipient",
    "search_placeholder": "Search",
    "copy_button": "Copy to clipboard",
    "preview_of_email": "Preview of the email",
    "preview_of_email_to": "Preview of the email to",
    "explanation": "You can copy the email fields or open it directly in your email client",
    "to_fill_in": "The following information needs to be filled in by hand in the email:"

};

const IDS = {
    search: 'dating-app-search',
    body: 'email-body',
    recipient: 'email-recipient',
    subject: 'email-subject',
    partsToFillIn: 'email-parts-to-fill-in'
};

const FEATURED_APPS = ["Bumble", "Tinder", "Match.com", "Meetic", "OkCupid", "Once",
                       "Hinge"];

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

function compareFeatured(appA, appB) {
    const aFeatured = FEATURED_APPS.includes(appA.itemLabel);
    const bFeatured = FEATURED_APPS.includes(appB.itemLabel);
    if(aFeatured == bFeatured){
        return compareItemLabel(appA, appB);
    }
    return aFeatured ? -1 : 1;
}

const unCamelCase = (string) => string.replace(/([a-z])([A-Z][a-z])/g, '$1 $2');

export class SubjectAccessRequestForm extends LitElement {

    static get styles() {
        return css`
        @import '/assets/styles/vendor/normalize.css';
        @import '/assets/styles/base/typography.css';
        @import '/assets/styles/elements/buttons.css';

       input {
          padding: 0.3em;
       }

       .app-selection {
          display:flex;
          margin-bottom: 0.5em;
       }

       .app-selection > label {
          width: 20%;
       }
       .app-selection > input {
          flex-grow: 1;
       }

       .app-buttons {
          display: flex;
          flex-wrap: wrap;
          margin: 0.5em 0 ;
       }

       .app-buttons.featured > span {
            width: 6em;
            height: 3em;
            display: flex;
            align-items: center;
            justify-content: center;
       }

       .app-buttons > span {
            width: 4.5em;
            height: 2em;
            overflow: hidden;
            border: 1px solid;
            margin: .15em;
            padding: .2em;
            text-overflow: ellipsis;
            /* Required for text-overflow to do anything */
            white-space: nowrap;
            cursor:  pointer;
            text-align: center;
       }

       .email-field {
          display:flex;
          margin-bottom: 0.5em;
       }

       .email-field > label {
          width: 20%;
       }

       .email-field > input {
          flex-grow: 1;
       }

       .copy {
          cursor: pointer;
          margin-left: 0.5em;
       }

       .email-body{
          display: flex

       }
       .email-body > textarea {
          flex-grow: 1;
          height: 20em;
          margin-bottom: 0.5em;
          padding: 0.75em;
       }
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

    appsForDisplay(){
        const appsClone = this.apps.slice();
        appsClone.sort(compareFeatured);
        return appsClone;
    }

    featuredApps(){
        const appsFeatured = this.apps.filter(app =>
            FEATURED_APPS.includes(app.itemLabel)
        );
        appsFeatured.sort(compareFeatured);
        return appsFeatured;
    }

    unfeaturedApps(){
        const appsUnfeatured = this.apps.filter(app =>
            !FEATURED_APPS.includes(app.itemLabel)
        );
        appsUnfeatured.sort(compareFeatured);
        return appsUnfeatured;
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
        const t = this;
        const email = t.byId(IDS.recipient).value;
        const subject = encodeURIComponent(t.byId(IDS.subject).value);
        const body = encodeURIComponent(t.byId(IDS.body).value);
        const urlString = `mailto:${email}?subject=${subject}&body=${body}`;
        const url = new URL(urlString);
        window.location.href = url.href;
    }

    getCopyIcon(){
       return svg`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`
    }

    render() {
        const t = this;
        return html`
          <div class="app-selection"">
            <label for="${IDS.search}">${translate("dating_app")}</label>
            <input placeholder="${translate("search_placeholder")}"
                   list="search-list"
                   id="${IDS.search}"
                   @keyup="${t.onSearchType}"
                   @input="${t.onSearch}">
            <datalist  id="search-list">
              ${t.apps.map(app =>
                   html`<option>${app.displayName}</option>`)}
            </datalist>
          </div>
          <div class="app-buttons featured">
              ${t.featuredApps().map(app =>
                  html`
                    <span @click="${_ => t.selectApp(app)}"
                          title="${app.displayName}">
                    ${app.displayName}
                    </span> `)}
          </div>
          <div class="app-buttons">
              ${t.unfeaturedApps().map(app =>
                  html`
                    <span @click="${_ => t.selectApp(app)}"
                          title="${app.displayName}">
                    ${app.displayName}
                    </span> `)}
          </div>
          <hr>
          <h2>${
            t.selectedApp ?
             html`${translate('preview_of_email_to')}
              <strong>${t.selectedApp.displayName}</strong>        `
            :
             translate('preview_of_email')
          } </h2>
          <p>${translate('explanation')}</p>
        ${!this.partsToFillIn.length ? '' : html`
          <div>
            <div>${translate("to_fill_in")}</div>
            <ul>
               ${this.partsToFillIn.map(p =>
                   html`<li>${p}</li>`)}
            </ul>
          </div>`
         }
          <div class="email-field">
            <label for="${IDS.recipient}">${translate("recipient")}</label>
            <input id="${IDS.recipient}" value="${t.recipient}">
            <span class="copy" title="${translate("copy_button")}"
                  @click="${_ => t.copyToClipboard(IDS.recipient)}">
               ${this.getCopyIcon()}
             </span>
          </div>
          <div class="email-field">
            <label for="${IDS.subject}">${translate("subject")}</label>
            <input id="${IDS.subject}" value="${t.subject}">
            <span class="copy" title="${translate("copy_button")}"
                  @click="${_ => t.copyToClipboard(IDS.subject)}">
               ${this.getCopyIcon()}
             </span>
          </div>
          <div class="email-body">
            <textarea placeholder="${translate("body_placeholder")}"
                      id="${IDS.body}">${t.body}</textarea>
            <span class="copy" title="${translate("copy_button")}"
                  @click="${_ => t.copyToClipboard(IDS.body)}">
               ${this.getCopyIcon()}
            </span>
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
