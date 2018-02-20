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
  'instagram.com': {
    isLoaded: () => window.instgrm !== undefined,
    reload: () => window.instgrm.Embeds.process(),
  },
  'twitter.com': {
    isLoaded: () => window.twttr !== undefined,
    reload: () => window.twttr.widgets.load(),
  },
};

/**
 * Given a script URL, locate a matching embed profile.
 *
 * @param {Src} src A script URL.
 * @returns {Object} An embed profile, or null.
 */
export const getEmbedConfiguration = src => Object.keys(embeds)
  .reduce((matchingEmbed, key) => (
    matchingEmbed || (src.indexOf(key) > -1 && embeds[key]) || null
  ), null);

export default embeds;
