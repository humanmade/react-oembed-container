'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Dictionary of overrides to customize the handling of certain scripts.
 *
 * Most scripts are designed to execute onload, but the better-documented
 * oEmbed scripts (such as Facebook's) can be manually re-initialized in
 * a predictable manner.
 *
 * The keys of this object are substrings that will be matched against
 * any detected script tag URLs.
 */
var embeds = {
  'connect.facebook.net': {
    isLoaded: function isLoaded() {
      // Ensure FB root element
      if (!document.querySelector('body > #fb-root')) {
        // There may be multiple #fb-root elements in a post's content: remove them
        // all in favor of a new body-level div.
        [].concat(_toConsumableArray(document.querySelectorAll('#fb-root'))).forEach(function (n) {
          return n.remove();
        });

        // Prepare and create the fb-root element. We only need one.
        var fbDiv = document.createElement('div');
        fbDiv.id = 'fb-root';
        document.body.prepend(fbDiv);
      }

      // Now the root element the script requires exists, check for the script iself.
      return window.FB !== undefined;
    },

    reload: function reload(container) {
      return window.FB.XFBML.parse(container);
    }
  },
  'instagram.com': {
    isLoaded: function isLoaded() {
      return window.instgrm !== undefined;
    },
    reload: function reload() {
      return window.instgrm.Embeds.process();
    }
  },
  'twitter.com': {
    isLoaded: function isLoaded() {
      return window.twttr !== undefined && window.twttr.widgets !== undefined;
    },
    reload: function reload() {
      return window.twttr.widgets.load();
    }
  }
};

/**
 * Given a script URL, locate a matching embed profile.
 *
 * @param {Src} src A script URL.
 * @returns {Object} An embed profile, or null.
 */
var getEmbedConfiguration = exports.getEmbedConfiguration = function getEmbedConfiguration(src) {
  return Object.keys(embeds).reduce(function (matchingEmbed, key) {
    return matchingEmbed || src.indexOf(key) > -1 && embeds[key] || null;
  }, null);
};

exports.default = embeds;