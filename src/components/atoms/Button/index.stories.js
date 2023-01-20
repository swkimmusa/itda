import React from 'react';

import Button from './index';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {},
};

const Template = (args) => (
  <Button {...args} />
);

export const Default = Template.bind({ selected: 0 });

Default.args = { label: 'Button' };
