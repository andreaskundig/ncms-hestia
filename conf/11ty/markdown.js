// https://github.com/11ty/eleventy/issues/658#issuecomment-599142642
let markdownIt = require("markdown-it")({
  html: true
});

// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
// Consider using this plugin if more customization is needed:
// https://github.com/crookedneighbor/markdown-it-link-attributes
//
// Remember old renderer, if overridden, or proxy to default renderer
var defaultRender = markdownIt.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

markdownIt.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  var aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

function markdownShortCode(content) {
  // How to make all links open a new tab:
  // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
  return markdownIt.render(content);
}

module.exports = { markdownShortCode, markdownIt };
