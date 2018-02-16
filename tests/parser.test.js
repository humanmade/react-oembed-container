import * as fixtures from './fixtures';

// import { parse } from '../index';

// const multipleScriptTags = `
// Some string <script src="https://website.test/script.js"></script>
// with multiple <script src="https://website.test/script-2.js"></script>
// scripts.
// `;

const ANY_SCRIPT = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const EXTERNAL_SCRIPT = /<script[^>]+src=(['"])(.*?)\1/i;
const INJECTED_SCRIPT = /<script[\s\S]*?>[\s\S]*?createElement[\s\S]*?src\s?=\s?(['"])(.*?)\1/i;

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

/**
 * Find the URI for the external file loaded from a script tag.
 *
 * @param {String} script The string HTML of a <script> tag.
 * @returns {String|null} The URI of the requested external script, otherwise null.
 */
export const extractExternalScriptURL = (script) => {
  const match = script.match(EXTERNAL_SCRIPT);
  // Return null if no match, otherwise return the second capture group.
  return match && match[2];
};

/**
 * Find the URI for a script being injected from inline JS.
 *
 * @param {String} script The string HTML of a <script> tag.
 * @returns {String|null} The URI of a script being injected from inline JS, otherwise null.
 */
export const extractInjectedScriptURL = (script) => {
  const match = script.match(INJECTED_SCRIPT);
  // Return null if no match, otherwise return the second capture group.
  return match && match[2];
};

/**
 * Match either external or inline-script-injected script tag source URIs.
 *
 * @param {String} script The string HTML of a <script> tag
 * @returns {String|null} The URI of the script file this script tag loads, or null.
 */
export const extractScriptURL = script => (
  extractExternalScriptURL(script) || extractInjectedScriptURL(script)
);

/**
 * Remove duplicate or undefined values from an array of strings.
 *
 * @param {String[]} Array script file URIs.
 */
const uniqueURIs = scripts => Object.keys(scripts.reduce((keys, script) => (
  script ? { ...keys, [script]: true } : keys
), {}));

/**
 * Parse a string of HTML and identify the JS files loaded by any contained script tags.
 *
 * @param {String} string String containing HTML markup which may include script tags.
 * @returns {String[]} Array of any script URIs we believe to be loaded in this HTML.
 */
const getScriptTags = (string) => {
  const scripts = string.match(/<script[\s\S]*?<\/script>/gi);
  return scripts ? uniqueURIs(scripts.map(extractScriptURL)) : [];
};

describe('script tag locator', () => {
  it('should identify script tags in content', () => {
    const result = getScriptTags(fixtures.twitter);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('https://platform.twitter.com/widgets.js');
  });

  it('should de-dupe repeated script tags', () => {
    const result = getScriptTags(fixtures.facebook);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12');
  });

  it('should be able to match multiple different script tags', () => {
    const result = getScriptTags(fixtures.all);
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
