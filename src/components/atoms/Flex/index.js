import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  flex: ${({ flex = 1 }) => flex};
`;

export default Flex;
