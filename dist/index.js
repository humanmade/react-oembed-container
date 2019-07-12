'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helpers = require('./helpers');

var _embeds = require('./embeds');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmbedContainer = function (_Component) {
  _inherits(EmbedContainer, _Component);

  function EmbedContainer() {
    _classCallCheck(this, EmbedContainer);

    return _possibleConstructorReturn(this, (EmbedContainer.__proto__ || Object.getPrototypeOf(EmbedContainer)).apply(this, arguments));
  }

  _createClass(EmbedContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var markup = this.props.markup;

      this.scripts = (0, _helpers.getScripts)(markup).map(function (src) {
        return _this2.injectScript(src);
      }).filter(Boolean);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.markup !== this.props.markup;
    }

    /**
     * Load a script URI and store references to the script tag nodes.
     *
     * @param {String} src The URI of the script to be loaded.
     * @param {HTMLElement} The injected script tag.
     */

  }, {
    key: 'injectScript',
    value: function injectScript(src) {
      var container = this.container;

      var embed = (0, _embeds.getEmbedConfiguration)(src);
      if (embed && embed.isLoaded()) {
        embed.reload(container);
      } else {
        return (0, _helpers.injectScriptTag)(src);
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          markup = _props.markup;

      markup.split(' ').join(' ');
      return _react2.default.createElement(
        'div',
        {
          className: className,
          ref: function ref(node) {
            _this3.container = node;
          }
        },
        children
      );
    }
  }]);

  return EmbedContainer;
}(_react.Component);

EmbedContainer.defaultProps = {
  className: null
};

EmbedContainer.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.arrayOf(_propTypes2.default.node)]).isRequired,
  className: _propTypes2.default.string,
  markup: _propTypes2.default.string.isRequired
};

exports.default = EmbedContainer;