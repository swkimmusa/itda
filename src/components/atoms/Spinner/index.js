import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import Icon from '../Icon';

const rotation = keyframes`
  from {transform: rotate(0deg);}
  to   {transform: rotate(360deg);}
`;
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = ({
  loading,
  size,
}) => {
  if (!loading) return null;
  return (
    <Wrapper>
      <Icon icon="loader" height={size} width={size} animation={rotation} />
    </Wrapper>
  );
};

Spinner.propTypes = {
  size: PropTypes.number,
  loading: PropTypes.bool,
};

Spinner.defaultProps = {
  size: 36,
  loading: true,
};

export default Spinner;
