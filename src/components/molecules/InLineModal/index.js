import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';

import Link from '../../atoms/Link';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';
import Flex from '../../atoms/Flex/index';

const Wrapper = styled.div`
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: ${(props) => (`${props.width}px`)};
  background-color: ${palette('white', 0)};
  /* background-color: #37C5B9; */
  align-items: center;
  overflow-y: auto;
  border-right: 2px solid #ECECEC;
  z-index: 2;
`;

const Container = styled(Flex)`
  padding: 20px;
  margin-top: 24px;
  margin-bottom: 48px;
  width: 100%;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
    padding: 0;
  }
`;
const LogoWrapper = styled.div`
  padding: 15px;
  background-color: ${palette('white', 0)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuLink = styled(Link)`
  display: flex;
  padding: 16px 0;
  color: ${palette('black', 0)};;
  padding: 25px 35px;
  border-left: 4px solid transparent;

  &.current-link,
  &:hover,
  &:focus {
    color: ${palette('black', 0)};;
    background-color: #E9F4F5;
    border-left: 4px solid ${palette('primary', 0)};
    text-decoration: none;
  }
`;

const InlineModal = ({
  width,
  links,
  onClose,
}) => (
  <Wrapper width={width}>
    <Content>
      {...children}
    </Content>
    <Button>
      <Icon icon="x" height={14} width={14} />
    </Button>
  </Wrapper>
);

InlineModal.defaultProps = {
  caretPos: 0,
  onClose: () => {},
};

InlineModal.propTypes = {
  width: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
  onClose: PropTypes.func,
};

export default InlineModal;
