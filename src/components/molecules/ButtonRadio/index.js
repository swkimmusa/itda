import { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import {
  palette, font, size,
} from 'styled-theme';
import {
  ifProp, switchProp, prop,
} from 'styled-tools';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';

const Container = styled(Flex)`
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-self: stretch;
  margin: 0px -5px;

  `;

const StyledButton = styled(Button)`
  background-color: ${palette('grayscale', 2)};
  background-color: ${ifProp(
    {
      selected: true,
      highlight: true,
    },
    palette('black', 0),
    'null',
  )};
  border-color: ${ifProp({ selected: true }, palette('primary', 0), palette('grayscale', 2))};
  border-color: ${ifProp(
    {
      selected: true,
      highlight: true,
    },
    palette('black', 0),
    'null',
  )};
  font-weight: ${ifProp({ selected: true }, 800, 400)};
  color: ${ifProp({ selected: true }, palette('black', 0), palette('grayscale', 0))};
  color: ${ifProp(
    {
      selected: true,
      highlight: true,
    },
    palette('primary', 0),
    'null',
  )};
  padding: 18px;
  flex-grow: 1;
  margin: 0px 5px;
`;

const ButtonRadio = ({
  options,
  highlight,
  onSelect,
  buttonStyle,
  selected,
  ...props
}) => {
  console.log(options);
  return (
    <Container
      {...props}
    >
      {options.map(({
        value,
        label,
        ...others
      }) => (
        <StyledButton
          key={value}
          highlight={highlight}
          onClick={() => {
            onSelect(value);
          }}
          label={label}
          selected={value === selected}
          style={buttonStyle}
          {...others}
        />
      ))}
    </Container>
  );
};

ButtonRadio.propTypes = {
  highlight: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string,
  })),
  selected: PropTypes.any,
  onSelect: PropTypes.func,
};

ButtonRadio.defaultProps = {
  highlight: false,
  options: [
    {
      value: 1,
      label: 'option 1',
    },
    {
      value: 2,
      label: 'option 2',
    },
  ],
  selected: 1,
  onSelect: (val) => console.log('[ButtonRadio] onSelect() ', val),
};

export default ButtonRadio;
