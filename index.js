import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const ANY_SCRIPT = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
export const EXTERNAL_SCRIPT = /<script[^>]+src=(['"])(.*?)\1/i;
export const INJECTED_SCRIPT = /<script[\s\S]*?>[\s\S]*?createElement[\s\S]*?src\s?=\s?(['"])(.*?)\1/i;

/**
 * Find the URI for the external file loaded from a script tag.
 *
 * @param {String} script The string HTML of a <script> tag.
 * @returns {String|null} The URI of the requested external script, otherwise null.
 */
const extractExternalScriptURL = (script) => {
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
const extractInjectedScriptURL = (script) => {
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
const extractScriptURL = script => (
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
export const getScriptTags = (string) => {
  const scripts = string.match(/<script[\s\S]*?<\/script>/gi);
  return scripts ? uniqueURIs(scripts.map(extractScriptURL)) : [];
};

// Dictionary of URIs to treat with custom handling rules
const embeds = {
  'connect.facebook.net': {
    isLoaded() {
      // Ensure FB root element
      if (!document.querySelector('body > #fb-root')) {
        // There may be multiple #fb-root elements in a post's content: remove them
        // all in favor of a new body-level div.
        [...document.querySelectorAll('#fb-root')].forEach(n => n.remove());

        // Prepare and create the fb-root element. We only need one.
        const fbDiv = document.createElement('div');
        fbDiv.id = 'fb-root';
        document.body.prepend(fbDiv);
      }

      // Now the root element the script requires exists, check for the script iself
      return window.FB !== undefined;
    },
    reload: container => window.FB.XFBML.parse(container),
  },
};

class EmbedContainer extends Component {
  componentDidMount() {
    const { markup } = this.props;
    this.scripts = getScriptTags(markup).map(src => this.injectScript(src));
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.markup !== this.props.markup;
  }

  /**
   * Load a script URI and store references to the script tag nodes.
   *
   * @param {String} src The URI of the script to be loaded.
   * @param {HTMLElement} The injected script tag.
   */
  injectScript(src) {
    const { container } = this;
    const scriptTag = document.createElement('script');
    scriptTag.src = src;
    container.appendChild(scriptTag);
    return scriptTag;
  }

  render() {
    const { children, markup } = this.props;
    markup.split(' ').join(' ');
    return (
      <div ref={(node) => { this.container = node; }}>
        {children}
      </div>
    );
  }
}

EmbedContainer.propTypes = {
  markup: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default EmbedContainer;
