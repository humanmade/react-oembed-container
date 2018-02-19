# oEmbedContainer

This package provides a React component wrapper to handle detecting and injecting script tags within HTML string content.

[![Build Status](https://travis-ci.org/humanmade/react-oembed-container.svg?branch=master)](https://travis-ci.org/humanmade/react-oembed-container)

## Background

Content management system API endpoints like those in WordPress often return editorial content as HTML strings rather than structured data. `dangerouslySetInnerHTML` is required to properly render this HTML content within a React application, or else any markup embedded in that string will not display properly.

Post content however may _also_ include `<script>` tags, which have no effect when injected via `innerHTML` [per the HTML5 specification](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML). Scripts are nullified on `innerHTML` to prevent cross-site scripting attacks, but this means that any content which contains a valid script as part of its HTML content will not properly render.

This issue is particularly noticeable when dealing with [**oEmbed**](https://oembed.com/)ded content, such as embedded Twitter or Facebook posts. Because many of these social media providers return `<script>` tags as part of their oEmbed response, WordPress will produce post content HTML which works fine when loaded from an application backend but which will not properly display embedded social content when rendered from React.

For example, WordPress will let you paste in a URL like `https://twitter.com/reactjs/status/964689022747475968` to the editor, then via an oEmbed request will convert it to the following rendered markup:

```html
<blockquote class=\"twitter-tweet\" data-width=\"525\" data-dnt=\"true\">
<p lang=\"en\" dir=\"ltr\">We&#39;re relicensing React Native (including Fresco, Metro, and Yoga) under the MIT license to match React. <a href=\"https://t.co/Ypg7ozX958\">https://t.co/Ypg7ozX958</a></p>
<p>&mdash; React (@reactjs) <a href=\"https://twitter.com/reactjs/status/964689022747475968?ref_src=twsrc%5Etfw\">February 17, 2018</a></p></blockquote>
<p><script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script></p>
```

These oEmbed HTML responses may not contain any scripts. If so, great! React can render that easily. But if they do, they will either contain script tags with `src` attributes pointing at an external JavaScript file (as in the twitter example above), or else an inline `<script>` tag with code that will create & inject a script into the DOM of the page as in Facebook's example:

```html
<div id=\"fb-root\"></div>
<p><script>
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
</script></p>
<div class=\"fb-post\" 
```

In order to properly display inlined oEmbed content, we need to detect and inject both types of scripts.

## A Note on Security

Technically what we're doing here is permitting arbitrary scripts injected into API responses to be rendered on the front-end of your site: under certain circumstances this can pose a security risk. However, these scripts would be rendered normally when loading this same markup from the server in a more traditional CMS-driven webpage rendering context.

It is up to the CMS to ensure that any scripts which make it far enough to be output on the page (or in API responses) are properly whitelisted or sanitized as necessary. Using WordPress as an example, only the responses from whitelisted oEmbed providers or content from highly authorized users may contain scripts at all; we therefore assume that any scripts inlined within the returned content are integral to the rendering of that content and should be loaded accordingly.

## Installation

```
npm install --save react-oembed-container
```

This library has peerdependencies on `react-dom` and `react` v16. If you do not already have these in your project, run

```
npm install --save react react-dom
```

## Usage

Import the container element into your React component:

```js
import EmbedContainer from 'react-oembed-container';
```

Then use this container to wrap whatever JSX you would normally use to render the content:

```js
render() {
  const { post } = this.props;
  return (
    <EmbedContainer markup={post.content.rendered}>

      {/* for example, */}
      <article id={`post-${post.id}`}>
        <h2>{ post.title.rendered }</h2>
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </article>

    </EmbedContainer>
  );
}
```

If you set a `className` on the `EmbedContainer` component, that class will be passed through to the rendered `<div>` container:

```js
render() {
  const { post } = this.props;
  return (
    <EmbedContainer
      className="article-content"
      markup={post.content.rendered}
    >
      <p>Article text here</p>
    </EmbedContainer>
  );
}
```
yields
```html
<div class="article-content"><p>Article text here</p></div>
```

## Local Development

Run `npm install` to pull down the dependencies for local development. Linting with ESLint is handled through `npm run lint`, and the Jest tests are run with `npm test`.

To work on this component, either use [`npm link`](https://docs.npmjs.com/cli/link) to bring it into another project for testing or else run `npm run storybook` within this repository to spin up a [Storybook](https://storybook.js.org/) UI development environment. This environment should be available locally at [localhost:6006](http://localhost:6006).
