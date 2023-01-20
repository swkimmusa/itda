import styled from 'styled-components';
import { palette } from 'styled-theme';

import Flex from '../Flex';

const Card = styled(Flex)`
  border-radius: 12px;
  padding: 20px;
  background-color: ${({
    white,
    blue,
  }) => (white ? palette('white', 0) : blue ? palette('blue', 1) : palette('grayscale', 2))};
  flex-direction: column;
`;

export default Card;
