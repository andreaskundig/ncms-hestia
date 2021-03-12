/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    _site: { url: '/', static: true },
    // this would serve what's in src under /dist
    // src: { url: '/dist' },
  },
  plugins: [
    ['@snowpack/plugin-run-script', { cmd: 'eleventy', watch: '$1 --watch' }],
    ['@snowpack/plugin-run-script',
     {'cmd': 'cross-env NODE_ENV=production postcss src/static/css/tailwind.css --o _site/static/css/style.css',
      watch: 'postcss src/static/css/tailwind.css --o _tmp/static/css/style.css --watch',
      'input': ['.css'], 'output': ['.css']}]
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    // Eleventy updates multiple files at once, so add a 300ms delay before we trigger a browser update
    hmrDelay: 300,
  },
  buildOptions: {
    /* ... */
  },
};
