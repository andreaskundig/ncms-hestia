// https://github.com/11ty/eleventy/issues/658#issuecomment-599142642
const markdownIt = require("markdown-it")({
  html: true
});

// all markdownIt rules
// https://github.com/markdown-it/markdown-it/blob/master/lib/parser_inline.js
const inline_rules = [
  'text', 'newline', 'escape', 'backticks',
  'strikethrough', 'emphasis', 'link', 'image',
  'autolink', 'html_inline', 'entity'
];
// https://github.com/markdown-it/markdown-it/blob/master/lib/parser_block.js
const block_rules = [
  'table', 'code', 'fence', 'blockquote', 'hr',
  'list', 'reference', 'html_block', 'heading',
  'lheading', 'paragraph'
];

const inlineMarkdownIt = require("markdown-it")();
inlineMarkdownIt.disable(inline_rules)
inlineMarkdownIt.disable(block_rules)
inlineMarkdownIt.enable([
  'paragraph',
  'text', 'strikethrough', 'emphasis',
  'link', 'autolink', 'entity' ])

function markdownShortCode(content) {
  return markdownIt.render(content);
}

function inlineMarkdownShortCode(content) {
  // console.log('inline', content)
  const html = inlineMarkdownIt.render(content);
  // console.log('inlined', html);
  return html;
}

module.exports = { inlineMarkdownShortCode, markdownShortCode, markdownIt };
