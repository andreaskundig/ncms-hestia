import { LitElement, html, css } from 'lit-element';

export class ArticleBreakout extends LitElement {

  static get styles() {
    return css`
      @import '/assets/styles/elements/buttons.css';

      :host { display: inline-block; }

      .box {
        color: var(--color-text-tertiary);
        background-color: var(--color-bg-secondary);
        padding: 1rem;
        margin-right: 1rem;
        max-width: 30rem;
        min-height: 6rem;
      }

      .box > h1 { margin-top: 0.5rem }
    `;
  }

  static get properties() {
    return {
      href: { type: String }
    }
  }

  constructor() {
    super();
  }

  render() {
    return html`<article class="box">
      <h1><a href="${this.href}"><slot></slot></a></h1>
      <a href="${this.href}"><button>Read more</button></a>
    </article>`
  }
}

customElements.define('article-breakout', ArticleBreakout);