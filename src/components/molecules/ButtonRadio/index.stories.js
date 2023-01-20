import React from 'react';

import ButtonRadio from './index';

export default {
  title: 'Molecules/ButtonRadio',
  component: ButtonRadio,
  argTypes: { selected: { controls: 'number' } },
};

const Template = (args) => (
  <ButtonRadio {...args} />
);

export const Default = Template.bind({});

Default.args = { };
