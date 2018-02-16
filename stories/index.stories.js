import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import EmbedContainer from '../index';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('EmbedContainer', module)
  .add('basic usage', () => (
    <EmbedContainer content="some string">
      <h2>Child Element</h2>
      <p>Child Element 2</p>
    </EmbedContainer>
  ));
