## `src/site/assets/large-media` ⟶ `assets/large-media/`

This folder contains **large media** assets, that are directly
stored in [Netlify's Large Media](https://docs.netlify.com/large-media/overview/)
infrastructure via [Git LFS](https://git-lfs.github.com),
and served at URL [`/assets/large-media/**`](https://hestialabs.org/assets/large-media/).

## Motivations

1. the large media assets are more efficiently delivered to
   end-users by Netlify's Edge servers and CDN , thru their
   dedicated «large media» infrastructure;
2. those assets don't need to be transferred from GitHub to
   Netlify, on every push/build of the site — saving precious
   build minutes, that we would have to pay for.

## Notes

The GitHub repository does not contain the binary
contents of the files of this folder. Instead, our repository
only contains a <1KB file, which holds a reference to the
actual binary contents, stored «elsewhere» by the LFS _provider_
that we did setup within this repository — that is, ‹Netlify
Large Media› infrastructure.

:warning: Which also importantly means: if the «elsewhere» was
**deleted** — that is, if we would delete the ‹HestiaLabs'› site
in Netlify's console, to recreate it from scratch for instance —,
the binary contents of this folder would be **gone/lost forever**,
without any way of recovering them from Netlify, our remote
LFS provider.

So before deleting the site at Netlify, ensure we hold a copy
somewhere. In case of doubt, create a complete mirror of the
repository. Follow instructions in this guide, for instance:

[Netlify › Docs › Large Media › Requirements and limitations› Delete a site with Large Media enabled](https://docs.netlify.com/large-media/requirements-and-limitations/#delete-a-site-with-large-media-enabled)

## See also

* [WEBSITE.DP #4](https://github.com/hestiaAI/website.dp/issues/4) Setup website hosting with Netlify