# oEmbedContainer

This package provides a React component wrapper to handle detecting and injecting script tags within HTML string content.

## Background

Content management system API endpoints like those in WordPress often return editorial content as HTML strings rather than structured data. `dangerouslySetInnerHTML` is required to properly render this HTML content within a React application, or else any markup embedded in that string will not display properly.

Post content however may _also_ include `<script>` tags, which have no effect when injected via `innerHTML` [per the HTML5 specification](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML). Scripts are nullified on `innerHTML` to prevent cross-site scripting attacks, but this means that any content which contains a valid script as part of its HTML content will not properly render.

This issue is particularly noticeable when dealing with [**oEmbed**](https://oembed.com/)ded content, such as embedded Twitter or Facebook posts. Because many of these social media providers return `<script>` tags as part of their oEmbed response, WordPress will produce post content HTML which works fine when loaded from an application backend but which will not properly display embedded social content when rendered from React.

These oEmbed HTML responses may either contain script tags with `src` attributes pointing at 

## Usage

Import the container element into your React component:
```js
import SocialEmbedContainer from 'react-oembed-container';
```
(or `OEmbedContainer` if you prefer; "oEmbed" uses a lowercase O, while React components traditionally use uppercase identifiers.)

Then use this container to wrap whatever components you would normally use to render the markup:
```js
render() {
  const { post } = this.props;
  return (
    <SocialEmbedContainer markup={post.content.rendered}>

      {/* for example, */}
      <article id={`post-${post.id}`}>
        <h2>{ post.title.rendered }</h2>
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </article>

    </SocialEmbedContainer>
  );
}
```

## Local Development

Run `npm install` to pull down the dependencies for local development. Linting with ESLint is handled through `npm run lint`, and the Jest tests are run with `npm test`.

To work on this component, either `npm link` it into another project or else run `npm run storybook` to spin up a [Storybook](https://storybook.js.org/) UI development environment. This environment should be available locally at [localhost:6006](http://localhost:6006).
