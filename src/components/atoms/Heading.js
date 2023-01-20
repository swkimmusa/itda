import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import {
  ifProp, switchProp, prop,
} from 'styled-tools';

const styles = css`
  font-family: ${(props) => (props.fontFamily ? props.fontFamily : font('primary'))};
  color: ${palette({
    grayscale: 1,
    secondary: 0,
  }, 0)};
  font-size: ${switchProp(prop('level'), {
    1: '30px',
    2: '26px',
  })};
  line-height: ${switchProp(prop('level'), {
    1: '36px',
    2: '30px',
  })};
  font-weight: ${switchProp(prop('level'), {
    1: '700', // bold
    2: '500', // medium
  })};
  text-align: ${ifProp({ center: true }, 'center')};
`;

const Heading = styled(
  ({
    level,
    children,
    reverse,
    palette,
    theme,
    ...props
  }) => React.createElement(`h${level}`, props, children),
)`
  ${styles};
`;

Heading.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
  palette: PropTypes.string,
  reverse: PropTypes.bool,
};

Heading.defaultProps = {
  level: 1,
  palette: 'primary',
};

export default Heading;
