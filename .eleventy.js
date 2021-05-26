// Eleventy configuration, integrated with Snowpack
// https://www.11ty.dev/docs/config/
/* eslint-env node */

const { buildLocalesCollection, formatDate} = require('./conf/11ty/locales');
const { backgroundImage } = require('./conf/11ty/backgroundImage')
const { creditedImage } = require('./conf/11ty/creditedImage')
const { internalLink } = require('./conf/11ty/internalLink')
const { renderLiquid } = require('./conf/11ty/liquid')
const {inlineMarkdownPairedShortCode, inlineMarkdownShortCode, markdownShortCode, markdownIt} = require('./conf/11ty/markdown');

module.exports = function (eleventyConfig) {

  // Copy to `dir.output` those files required by the website,
  // but not recognized by Eleventy as valid template files.
  // Note: Passthrough File Copy entries are relative to the root
  // of the project and not Eleventy `dir.input` directory.
  eleventyConfig.addPassthroughCopy("src/site/assets");
  eleventyConfig.addPassthroughCopy("src/site/favicon*");
  eleventyConfig.addPassthroughCopy("src/site/manifest.json");
  eleventyConfig.addPassthroughCopy("src/site/robots.txt");
  eleventyConfig.addPassthroughCopy("src/site/admin/*.js");
  eleventyConfig.addPassthroughCopy("src/site/admin/doc/*.png");
  eleventyConfig.addPassthroughCopy({ "conf/netlify/cms/config.yml": "admin/config.yml" });
  eleventyConfig.addPassthroughCopy({ "conf/netlify/forms/*.html": "admin/forms/" });

  eleventyConfig.addCollection("locales", buildLocalesCollection);

  eleventyConfig.addFilter("readableDate", formatDate);
  eleventyConfig.addFilter("backgroundImage", backgroundImage);
  eleventyConfig.addShortcode("creditedImage", creditedImage);
  eleventyConfig.addPairedShortcode("ilink", internalLink);
  eleventyConfig.addShortcode("markdown", (s) => markdownShortCode(s||''));
  eleventyConfig.addShortcode("inlineMarkdown", inlineMarkdownShortCode);
  eleventyConfig.addPairedShortcode("inlineMarkdownP", inlineMarkdownPairedShortCode);
  eleventyConfig.addShortcode("renderLiquid", renderLiquid);

  eleventyConfig.setLibrary("md", markdownIt);

  // Let Eleventy transform HTML files as Nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      output: "build/11ty",     // linked to Snowpack `mount` setting
      input: "src/site",
      data: "_data",            // (default value) relative to `dir.input`
      includes: "_includes",    // (default value) relative to `dir.input`
      layouts:  "_layouts",     // (overrides default) still relative to `dir.input`
    },
    // templateFormats: ["html", "md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // don't preprocess global data.
    dataTemplateEngine: false
  };
};
