import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getScripts, injectScriptTag } from './helpers';
import { getEmbedConfiguration } from './embeds';

class EmbedContainer extends Component {
  componentDidMount() {
    const { markup } = this.props;
    this.scripts = getScripts(markup)
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
      return injectScriptTag(src);
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
