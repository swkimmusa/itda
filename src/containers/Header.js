import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import styled from 'styled-components';
import {
  palette, size, font,
} from 'styled-theme';
import {
  useParams, useLocation, useNavigate,
} from 'react-router-dom';

import moment from 'moment';
import get from 'lodash/get';
import Icon from '../components/atoms/Icon';
import Text from '../components/atoms/P';
import Button from '../components/atoms/Button';
import { selectUser } from '../store/authentication/selectors';
import action from '../store/leftMenu/actions';
import RightMenuContainerComp from '../components/molecules/RightMenuContainer';
import Flex from '../components/atoms/Flex';

const { open } = action;

const HeaderContainer = styled.div`
  padding: 10px 25px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background-color: ${palette('white', 0)};
  border-bottom: 1px solid #ECECEC;

  @media (max-width: ${size('mobileBreakpoint')}) {
    padding: 10px;
    z-index: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: white;
  }
`;
const LeftContainer = styled(Flex)`
  align-items: center;
`;

const RightContainer = styled(Flex)`
  display: flex;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  margin-bottom: -5px;
`;

const StyledText = styled(Text)`
  && {
    margin-bottom: 0;
    color: ${palette('black', 0)};

    @media (max-width: ${size('mobileBreakpoint')}){
      color: ${palette('black', 0)};
      margin-left: auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const LeftMenuButtonContainer = styled(Flex)`
  @media (max-width: ${size('mobileBreakpoint')}) {
    display: flex;
    flex-direction: row;
    color: white;
    width: 20%;
  }
`;

const LeftMenuButton = styled(Flex)`
  flex: 0;
  min-width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
`;

const LogoTextContainer = styled(Flex)`
  align-items: center;
`;

const LogoText = styled(Text)`
  font-size: 20px;
  margin-left: 10px;
  white-space: nowrap;
  color: black;
  font-weight: 700; //bold

`;

const StyledHeading = styled(Text)`
`;

const Header = ({
  title,
  level,
  renderRight,
  icon,
  user,
  menuOpen,
  onClose,
  notifications,
}) => {
  return (
    <HeaderContainer>
      <LeftMenuButtonContainer>
        <LeftMenuButton onClick={() => open()} tabIndex="0">
          <Icon icon="logo" classnames="filled" height={20} />
        </LeftMenuButton>
        <LogoTextContainer>
          <LogoText>itda</LogoText>
        </LogoTextContainer>
      </LeftMenuButtonContainer>
      <StyledHeading>
        { icon && <StyledIcon icon={icon} />}
        {startCase(title)}
      </StyledHeading>
      <RightContainer>
        {renderRight && renderRight()}
      </RightContainer>
    </HeaderContainer>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  renderRight: PropTypes.func,
  icon: PropTypes.string,
  user: PropTypes.object,
  isPageHeader: PropTypes.bool,
};

Header.defaultProps = {};

const mapStateToProps = (state) => {
  console.log(state);
  const menuState = state.leftMenu;
  return {
    user: selectUser(state.authentication),
    menuOpen: menuState.open,
  };
};

const mapDispatchToProps = () => ({ onClose: () => {} });

export default connect(mapStateToProps, mapDispatchToProps)(Header);
