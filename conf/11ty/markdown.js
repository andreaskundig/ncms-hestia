// https://github.com/11ty/eleventy/issues/658#issuecomment-599142642
let markdownIt = require("markdown-it")({
  html: true
});

function markdownShortCode(content) {
  return markdownIt.render(content);
}

module.exports = { markdownShortCode, markdownIt };
