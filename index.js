import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class EmbedContainer extends PureComponent {
  render() {
    const { children, content } = this.props;
    content.split(' ').join(' ');
    return (
      <div>
        {children}
      </div>
    );
  }
}

EmbedContainer.propTypes = {
  content: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default EmbedContainer;
