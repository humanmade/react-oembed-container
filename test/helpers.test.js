import * as fixtures from './fixtures';

import {
  ANY_SCRIPT,
  EXTERNAL_SCRIPT,
  INJECTED_SCRIPT,
  getScripts,
} from '../src/helpers';

describe('Script Detection Regular Expressions', () => {
  const noScriptTag = 'String with no script tag';
  const malformedScriptTag = '<script src"</script>';
  const doubleQuoteScriptTag = '<script async src="https://assets.tumblr.com/post.js"></script>';
  const singleQuoteScriptTag = '<script async defer src=\'//www.instagram.com/embed.js\'></script>';
  const mismatchedQuoteScriptTag = '<script async defer src="//www.instagram.com/embed.js\'></script>';
  const scriptWithoutURI = '<script>/* inline, no tag created */;</script>';
  const singleQuoteInjectedScript = '<script>js = d.createElement(s); js.src = \'https://connect.facebook.net/sdk.js\'; /* other stuff */</script>';
  const doubleQuoteInjectedScript = '<script>js = d.createElement(s); js.id="foo"; js.src = "https://connect.facebook.net/sdk.js";</script>';
  const mismatchedQuoteInjectedScript = '<script>js = d.createElement(s); js.id="foo"; js.src = \'https://connect.facebook.net/sdk.js";</script>';

  describe('ANY_SCRIPT', () => {
    it('does not match strings without well-formed script tags', () => {
      expect(noScriptTag.match(ANY_SCRIPT)).toBeNull();
      expect(malformedScriptTag.match(ANY_SCRIPT)).toBeNull();
    });

    it('matches any variant of script tag', () => {
      expect(doubleQuoteScriptTag.match(ANY_SCRIPT)).not.toBeNull();
      expect(singleQuoteScriptTag.match(ANY_SCRIPT)).not.toBeNull();
      expect(scriptWithoutURI.match(ANY_SCRIPT)).not.toBeNull();
      expect(singleQuoteInjectedScript.match(ANY_SCRIPT)).not.toBeNull();
      expect(doubleQuoteInjectedScript.match(ANY_SCRIPT)).not.toBeNull();
    });
  });

  describe('EXTERNAL_SCRIPT', () => {
    it('does not match strings without script tags or malformed script tags', () => {
      expect(noScriptTag.match(EXTERNAL_SCRIPT)).toBeNull();
      expect(malformedScriptTag.match(EXTERNAL_SCRIPT)).toBeNull();
      expect(mismatchedQuoteScriptTag.match(EXTERNAL_SCRIPT)).toBeNull();
    });

    it('matches script tags with a well-formed src attribute', () => {
      expect(doubleQuoteScriptTag.match(EXTERNAL_SCRIPT)).not.toBeNull();
      expect(singleQuoteScriptTag.match(EXTERNAL_SCRIPT)).not.toBeNull();
    });

    it('does not match inline scripts without src attribute', () => {
      expect(scriptWithoutURI.match(EXTERNAL_SCRIPT)).toBeNull();
      expect(singleQuoteInjectedScript.match(EXTERNAL_SCRIPT)).toBeNull();
      expect(doubleQuoteInjectedScript.match(EXTERNAL_SCRIPT)).toBeNull();
      expect(mismatchedQuoteInjectedScript.match(EXTERNAL_SCRIPT)).toBeNull();
    });
  });

  describe('INJECTED_SCRIPT', () => {
    it('does not match strings without script tags or malformed script tags', () => {
      expect(noScriptTag.match(INJECTED_SCRIPT)).toBeNull();
      expect(malformedScriptTag.match(INJECTED_SCRIPT)).toBeNull();
      expect(mismatchedQuoteScriptTag.match(INJECTED_SCRIPT)).toBeNull();
    });

    it('does not match script tags with src attribute', () => {
      expect(doubleQuoteScriptTag.match(INJECTED_SCRIPT)).toBeNull();
      expect(singleQuoteScriptTag.match(INJECTED_SCRIPT)).toBeNull();
    });

    it('does not match inline scripts without script injection code', () => {
      expect(scriptWithoutURI.match(INJECTED_SCRIPT)).toBeNull();
    });

    it('only matches script tag src attribute assignment if string is well-formed', () => {
      expect(mismatchedQuoteInjectedScript.match(INJECTED_SCRIPT)).toBeNull();
    });

    it('matches the URI of script tags injected via inline scripts', () => {
      expect(singleQuoteInjectedScript.match(INJECTED_SCRIPT)).not.toBeNull();
      expect(doubleQuoteInjectedScript.match(INJECTED_SCRIPT)).not.toBeNull();
    });
  });
});

describe('getScripts', () => {
  it('should identify script tags in content', () => {
    const result = getScripts(fixtures.twitter);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('https://platform.twitter.com/widgets.js');
  });

  it('should de-dupe repeated script tags', () => {
    const result = getScripts(fixtures.facebook);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12');
  });

  it('should be able to match multiple different script tags', () => {
    const result = getScripts(fixtures.all);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12',
      'https://platform.twitter.com/widgets.js',
      'https://assets.tumblr.com/post.js',
      '//www.instagram.com/embed.js',
      'https://embed.redditmedia.com/widgets/platform.js',
      'https://v0.wordpress.com/js/next/videopress-iframe.js?m=1435166243',
      '//e.issuu.com/embed.js',
    ]);
  });
});
