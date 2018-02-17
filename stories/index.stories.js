import React from 'react';

import { storiesOf } from '@storybook/react';

import * as fixtures from '../test/fixtures';

import EmbedContainer from '../src/index';

/* eslint-disable react/no-danger */
const testEmbedContainerWith = markup => (
  <EmbedContainer markup={markup}>
    <div dangerouslySetInnerHTML={{ __html: markup }} />
  </EmbedContainer>
);
/* eslint-enable react/no-danger */

storiesOf('EmbedContainer', module)
  .add('All Embeds At Once', () => testEmbedContainerWith(fixtures.all))
  .add('Facebook', () => testEmbedContainerWith(fixtures.facebook))
  .add('Twitter', () => testEmbedContainerWith(fixtures.twitter))
  .add('WordPress', () => testEmbedContainerWith(fixtures.wordpress))
  .add('YouTube', () => testEmbedContainerWith(fixtures.youtube))
  .add('Vimeo', () => testEmbedContainerWith(fixtures.vimeo))
  .add('Tumblr', () => testEmbedContainerWith(fixtures.tumblr))
  .add('Instagram', () => testEmbedContainerWith(fixtures.instagram))
  .add('Mixcloud', () => testEmbedContainerWith(fixtures.mixcloud))
  .add('Spotify', () => testEmbedContainerWith(fixtures.spotify))
  .add('Soundcloud', () => testEmbedContainerWith(fixtures.soundcloud))
  .add('TED', () => testEmbedContainerWith(fixtures.ted))
  .add('Kickstarter', () => testEmbedContainerWith(fixtures.kickstarter))
  .add('Meetup', () => testEmbedContainerWith(fixtures.meetup))
  .add('Reddit', () => testEmbedContainerWith(fixtures.reddit))
  .add('WordPress.tv', () => testEmbedContainerWith(fixtures.wordpresstv))
  .add('Issuu', () => testEmbedContainerWith(fixtures.issuu))
  .add('Flickr', () => testEmbedContainerWith(fixtures.flickr))
  .add('CollegeHumor', () => testEmbedContainerWith(fixtures.collegehumor));
