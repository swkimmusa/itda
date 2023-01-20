import React from 'react';
import { storiesOf } from '@storybook/react';

import Header from './Header';

storiesOf('Organisms|Header', module).add('default', () => (
  <Header isPageHeader={true} title="title" />
));

