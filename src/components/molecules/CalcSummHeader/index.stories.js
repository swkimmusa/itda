import React from 'react';

import CalcSummHeader from './index';

export default {
  title: 'Molecules/CalcSummHeader',
  component: CalcSummHeader,
  argTypes: {},
};

const Template = (args) => (
  <div style={{ width: 400 }}>
    <CalcSummHeader {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {};
