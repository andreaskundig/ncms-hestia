import { LitElement, html, css } from 'lit-element';

export class ArticleBreakout extends LitElement {

  static get styles() {
    return css`
      @import '/assets/styles/elements/buttons.css';

      :host { display: inline-block; }

      .box {
        color: var(--color-text-tertiary);
        background-color: var(--color-bg-tertiary);
        padding: 1rem;
        margin-right: 1rem;
        max-width: 30rem;
        min-height: 6rem;
      }

      figure, figure > img {
        max-width: 100%;
        width: 100%;
        height: auto;
        margin: 0 auto;
      }

      figure > figcaption {
        display: none;
      }

      .box > h1 { margin-top: 0.5rem }
    `;
  }

  static get properties() {
    return {
      href: { type: String },
      imgSrc: { type: String }
    }
  }

  constructor() {
    super();
  }

  render() {
    return html`<a href="${this.href}">
      <article class="box">
        <figure>
          <img src="${this.imgSrc}">
          <figcaption/><slot name="img-caption"/><figcaption>
        </figure>
        <h1><slot name="title"/></h1>
        <p><slot></slot></p>
        <button>Read more</button>
      </article>
    </a>`
  }
}

customElements.define('article-breakout', ArticleBreakout);
