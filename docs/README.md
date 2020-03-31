# docs/

This folder contains the content for the [humanmade.github.io/react-oembed-container](https://humanmade.github.io/react-oembed-container) documentation site.

The docs site uses the ["just-the-docs" Jekyll theme](https://pmarsceill.github.io/just-the-docs) by Patrick Marsceill.

## Running Locally

To run the docs site locally (useful when creating or updating content), you should have Ruby and bundler installed. Because this process is platform-specific we do not provide instructions here.

To install dependencies, run
```
bundle install
```
from the `docs/` folder. This will pull down a number of Ruby packages which together allow us to build the theme and publish the site to GitHub.

To run the dev server locally, run
```
bundle exec jekyll serve
```
to run the docs site at [localhost:4000](http://localhost:4000). Be aware that the site will rebuild in the background as you make changes, but it will not live-reload.

## Storybook

Running `npm run build-storybook` in the root directory of this repository will regenerate the `/storybook` directory within this folder.
