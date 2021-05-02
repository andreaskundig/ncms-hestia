import { LitElement, html, css } from 'lit-element';

/**
 * ‹video-player› custom element, displaying a thumbnail,
 * a video and its controls, with a title and description.
 *
 * Attributes:
 *
 *   href (mandatory): String
 *     URL of full article, to redirect to when the
 *     article breakout is clicked anywhere.
 *
 *   img-src (optional): String
 *     URL of an image thumbnail of the video.
 *
 * Slots:
 *
 *   caption (optional): String|Inline
 *
 *      Video caption, which should contain raw text
 *      or inline-elements only (<a> for instance); not
 *      displayed to user, only visible in source code.
 *
 *      Recommended structure:
 *
 *          <span slot="caption">…</span>
 *
 *   ‹default› (optional): Inline|Block
 *
 *      Title and description of the video.
 *
 *      Recommended structure:
 *
 *          <h1>Video title</h1>
 *          <p>Short presentation of the video</p>
 *
 * Sample usage:
 *
 *     <video-player
 *           href="/assets/large-media/20210212-zoom-presentation.mp4"
 *           img-src="/assets/large-media/20210212-zoom-presentation.thumbnail.jpg">
 *       <span slot="caption">Video by …</span>
 *       <h2>Presentation of ‹Dating Privacy› project on 12.02.2021</h2>
 *       <p>An <em>attention</em>-<strong>grabbing</strong> lead.</p>
 *     </video-player>
 *
*/
export class VideoPlayer extends LitElement {

  static get styles() {
    return css`
      :root {
        --breakout-text-color:  #333333;
        --breakout-bg-color:    #f6f8fa;
        --line-height-half:     0.5rem;
        --breakout-shadow:      0 3px 6px rgba(27,31,35,0.8);
        --breakout-img-shadow:  1px 2px 4px rgba(27,31,35,0.8);
        --breakout-padding:     1rem;
      }

      :host {
        display: block; }

      video {
        display: block;
        max-width: 100%;
        width: 100%;
        margin: 0 0; }

      img {
        box-shadow: var(--breakout-img-shadow);
        object-fit: cover;
        width: 100%; }
      }
    `;
  }

  static get properties() {
    return {
      src: { type: String },
      imgSrc: { type: String, attribute: "img-src" },
    }
  }

  constructor() {
    super();
    this.src = undefined;
    this.imgSrc = undefined;
  }

  render() {
    return html`
      <slot></slot>
      <video controls
        src="${this.src}"
        poster="${this.imgSrc}">
        <p>Sorry, your browser doesn't support HTML5 embedded videos.
      Here is <a href="${this.src}">a link to download the video</a>.</p>
      </video>
    `;
  }
}

customElements.define('video-player', VideoPlayer);