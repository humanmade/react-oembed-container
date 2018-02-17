import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getScriptTags } from './helpers';

// Dictionary of overrides to customize the handling of certain scripts;
// most scripts are designed to execute onload, but the better-documented
// oEmbed scripts (such as Facebook's) can be manually re-initialized in
// a predictable manner.
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

      // Now the root element the script requires exists, check for the script iself.
      return window.FB !== undefined;
    },
    reload: container => window.FB.XFBML.parse(container),
  },
};

const getEmbedConfiguration = src => Object.keys(embeds)
  .reduce((matchingEmbed, key) => (
    matchingEmbed || (src.indexOf(key) > -1 && embeds[key]) || null
  ), null);

class EmbedContainer extends Component {
  componentDidMount() {
    const { markup } = this.props;
    this.scripts = getScriptTags(markup)
      .map(src => this.injectScript(src))
      .filter(Boolean);
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
    const embed = getEmbedConfiguration(src);
    if (embed && embed.isLoaded()) {
      embed.reload(container);
    } else {
      const scriptTag = document.createElement('script');
      scriptTag.src = src;
      document.head.appendChild(scriptTag);
      return scriptTag;
    }
    return null;
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
