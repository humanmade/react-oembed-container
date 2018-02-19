import React from 'react';
import { mount } from 'enzyme';
import EmbedContainer from '../src/index';
import * as helpers from '../src/helpers';

describe('Social Embed Container', () => {
  let scripts;
  const injectScriptTag = jest.spyOn(helpers, 'injectScriptTag')
    .mockImplementation(script => scripts.push(script));

  beforeEach(() => {
    scripts = [];
    injectScriptTag.mockClear();
  });

  it('should render the provided child without throwing an error', () => {
    const container = mount((
      <EmbedContainer markup="String <code>HTML</code> Content">
        String <code>HTML</code> Content
      </EmbedContainer>
    ));
    expect(container.html()).toBe('<div>String <code>HTML</code> Content</div>');
  });

  it('Should pass through any provided className', () => {
    const container = mount((
      <EmbedContainer markup="String <code>HTML</code> Content" className="test classes">
        String <code>HTML</code> Content
      </EmbedContainer>
    ));
    expect(container.html()).toBe('<div class="test classes">String <code>HTML</code> Content</div>');
  });

  it('should enqueue any detected script tag', () => {
    mount((
      <EmbedContainer markup={`
        <p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>`}
      >
        <div />
      </EmbedContainer>
    ));
    expect(injectScriptTag).toHaveBeenCalled();
    expect(scripts).toEqual(['https://platform.twitter.com/widgets.js']);
  });

  it('should only enqueue any given script once', () => {
    mount((
      <EmbedContainer markup={`
        <p><script async src="https://assets.tumblr.com/post.js"></script></p>
        <p><script async src="https://assets.tumblr.com/post.js"></script></p>
        <p><script async src="https://assets.tumblr.com/post.js"></script></p>`}
      >
        <div />
      </EmbedContainer>
    ));
    expect(injectScriptTag).toHaveBeenCalled();
    expect(scripts).toEqual(['https://assets.tumblr.com/post.js']);
  });

  it('should detect JavaScript files injected from inline script tags', () => {
    mount((
      <EmbedContainer markup={`
        <p><script>
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        </script></p>`}
      >
        <div />
      </EmbedContainer>
    ));
    expect(injectScriptTag).toHaveBeenCalled();
    expect(scripts).toEqual(['https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12']);
  });

  it('should not inject any script if no scripts are present', () => {
    mount((
      <EmbedContainer markup="String <code>HTML</code> Content">
        String <code>HTML</code> Content
      </EmbedContainer>
    ));
    expect(injectScriptTag).not.toHaveBeenCalled();
  });
});
