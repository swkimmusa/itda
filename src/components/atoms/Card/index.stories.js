import React from 'react';

import Card from './index';

export default {
  title: 'Atoms/Card',
  component: Card,
  argTypes: {},
};

const Template = (args) => (
  <Card {...args} />
);

export const Default = Template.bind({});

Default.args = { label: 'Card' };
