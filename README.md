# ‹Dating Privacy› website

[![Netlify Status](https://api.netlify.com/api/v1/badges/98d7a43c-3306-4444-b108-6543ace144b6/deploy-status)](https://app.netlify.com/sites/hestialabs-dating-privacy/deploys)

The HestiaLabs ‹Dating Privacy› website:

* [`dating-privacy.hestialabs.org/{fr,en}`](https://dating-privacy.hestialabs.org/en/) ⟵ is currently accessible here;
* [`hestialabs-dating-privacy.netlify.app/{fr,en}`](https://hestialabs-dating-privacy.netlify.app/en/) ⟵ as well as here.

# Deliverables

The website is currently made of two major deliverables; whose sources are available in this repository:

1. [`dating-privacy.hestialabs.org`](https://dating-privacy.hestialabs.org/): publicly accessible website of HestiaLabs, in french and english;
2. [`dating-privacy.hestialabs.org/admin`](https://dating-privacy.hestialabs.org/admin/): our [content-authoring system (_aka_ NetlifyCMS)](https://www.netlifycms.org), accessible thru invite only.

# Access rights

## NetlifyCMS

Would you need _editorial access_ to the website contents — that is, to our NetlifyCMS content-authoring & management system:

* ask [@olange](https://github.com/olange) or [@andreaskundig](https://github.com/andreaskundig) for an invite to the HestiaLabs site;
* access is defined from [Netlify › Hestia _team_ › HestiaLabs Dating Privacy _site_ › Identity](https://app.netlify.com/sites/hestialabs-dating-privacy/identity) webpage.

## Netlify

Would you need to _administer_ our Netlify deployment & hosting infrastructure:

* ask [@olange](https://github.com/olange) or [@andreaskundig](https://github.com/andreaskundig) to share access with you to the [Netlify › Hestia Team](https://app.netlify.com/teams/hestia/overview) account;
* we sign-in with a single shared `service-owners+netlify` Netlify account (2FA-enabled), to run our hosting with [Netlify's Starter Free Plan](https://www.netlify.com/pricing).

# Repository contents

## Overview & repository structure

```ascii
/ ....................... NPM, 11ty & Netlify scripts for assembly, publishing & deployment
|
+-- conf/ ............... Config of our publish & deploy pipeline
|   +-- 11ty/ ........... Eleventy config files included from .eleventy.js
|   +-- netlifycms/ ..... NetlifyCMS config file, deployed to admin/ upon build
|
+-- src/ ................ Sources (en/fr) of the components used to generate the website
|   +-- components/ ..... Web Components (front-end) used in layouts
|   +-- site/ ........... Actual contents of website, along with layouts and assets
|       +-- _data/ ...... Fragments of data consumed by 11ty to generate static pages
|       +-- _includes/ .. Layouts and includes consumed by 11ty to generate static pages
|       +-- assets/ ..... Media assets, such as stylesheets and images used by theme or uploaded by users
|       +-- admin/ ...... NetlifyCMS single-page app, to edit contents online
|       +-- home/ ....... Main homepage
|       +-- about/ ...... About us page
|       +-- blog/ ....... Blog homepage
|       +-- post/ ....... Blog articles
|       +-- category/ ........ Categories of blog articles
|
+-- build/ .............. (transient) Generated website, in its various stages
    +-- 11ty/ ........... (transient) Generated by 11ty, picked up by Snowpack
    +-- snowpack/ ....... (transient) Generated by Snowpack and deployed by Netlify
```

## Essential configuration files

```ascii
/ 
|
+-- netlify.toml ......... Netlify CB/CD and hosting config, which includes definition of
|                          runtime URL redirects, role-based access restrictions and HTTP-header overrides
+-- .eleventy.js ......... In-/out folders and config of 11ty build process
+-- .snowpack.config.js .. In-/out folders and config of Snowpack dev & build processes
|
+-- conf/netlifycms/
    +-- config.yml ....... NetlifyCMS runtime config
```

## Further information

See the README in the master [WEBSITE.LABS](https://github.com/hestiaAI/website.labs) website.