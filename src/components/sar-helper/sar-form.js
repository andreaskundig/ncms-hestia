import { LitElement, html, css } from 'lit-element';
import { fetchDatingApps, fetchMailTo } from './personaldata-io.js';

function compareItemLabel(appA, appB) {
    const nameA = appA.itemLabel.toUpperCase();
    const nameB = appB.itemLabel.toUpperCase();
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
}


export class SubjectAccessRequestForm extends LitElement {

    static get styles() {
        return css`
          .inline{ display: inline-block; }
     `;
    }

    static get properties() {
        return {
            apps: { type: Array },
            search: { type: String },
            recipient: { type: String },
            subject: { type: String },
            body: { type: String },
            id: { type: Object }
        }
    }

    constructor() {
        super();
        this.apps = [];
        this.search = '';
        this.recipient = '';
        this.subject = '';
        this.body = '';
        this.fetchApps();
        this.ids = {
            select: 'dating-app-select',
            body: 'email-body',
            recipient: 'email-recipient',
            subject: 'email-subject'
        };
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
        }
    }

    onSearch(event){
        const search = event.target;
        const select = this.byId(this.ids.select);
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

    createMailToFromFields() {
        const t = this;
        console.log('heee',this.ids.subject, t.byId(t.ids.subject))
        const email = t.byId(t.ids.recipient).value;
        const subject = encodeURIComponent(t.byId(t.ids.subject).value);
        const body = encodeURIComponent(t.byId(t.ids.body).value);
        const urlString = `mailto:${email}?subject=${subject}&body=${body}`;
        const url = new URL(urlString);
        window.location.href = url.href;
    }

    render() {
        const t = this;
        const ids = this.ids;
        return html`
          <div class="inline">
            <label for="${ids.select}">Dating app</label>
            <select id="${ids.select}" @change="${t.onSelectApp}">
               <option disabled selected value> Click to choose </option>
              ${t.apps.map(app =>
               html`<option data-item="${app.item}"
                             value="${app.itemLabel}">
                        ${app.itemLabel}</option>`)}
            </select>
          </div>
          <div class="inline">
            <input placeholder="search" list="search-list"
                   value="${t.search}"
                   @input="${t.onSearch}">
            <datalist  id="search-list">
              ${t.apps.map(app =>
                   html`<option value="${app.itemLabel}"></option>`)}
            </datalist>
          </div>
          <div>
            <label for="${ids.recipient}">Recipient</label>
            <input id="${ids.recipient}" value="${t.recipient}">
            <button @click="${_ => t.copyToClipboard(ids.recipient)}">
               Copy to clipboard
             </button>
          </div>
          <div>
            <label for="${ids.subject}">Subject</label>
            <input id="${ids.subject}" value="${t.subject}">
            <button @click="${_ => t.copyToClipboard(ids.subject)}">
               Copy to clipboard
             </button>
          </div>
          <div>
            <label for="${ids.body}">Body</label>
            <textarea placeholder="Choose an app to fill this automatically."
                      id="${ids.body}">${t.body}</textarea>
            <button @click="${_ => t.copyToClipboard(ids.body)}">
               Copy to clipboard
            </button>
          </div>
          <div>
            <button @click="${t.createMailToFromFields}">
                Open in your email client
            </button>
          </div>
     `;
    }

    byId(id) {
        return this.shadowRoot.querySelector('#' + id);
    }
}

customElements.define('sar-form', SubjectAccessRequestForm);
