import {
  useEffect,
  useState,
} from 'react';

import styled, { css } from 'styled-components';

import {
  font, palette,
} from 'styled-theme';
import { ifProp } from 'styled-tools';

import Flex from '../../atoms/Flex';

import theme from '../../../theme';

const Container = styled(Flex)`
  flex: initial;
  background-color: ${palette('grayscale', 3)};
`;
const Bar = styled(Flex)`
  flex: initial;
  transition: width 200ms ease-in;
  background-color: ${palette('grayscale', 3)};
`;

const ProgressBar = ({
  color = theme.palette.primary[0],
  percentage,
  size = 3,
}) => {
  const [
    width,
    setWidth,
  ] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      setWidth(`${percentage}%`);
    });
  }, [percentage]);

  return (
    <Container
      style={{ height: size }}
    >
      <Bar
        style={{
          width,
          backgroundColor: color,
        }}
      />
    </Container>
  );
};

export default ProgressBar;
