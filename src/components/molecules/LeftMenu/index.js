import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';
import * as serviceWorkerRegistration from '../../../serviceWorkerRegistration';

import Link from '../../atoms/Link';
import Icon from '../../atoms/Icon';

const Wrapper = styled.div`
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: ${(props) => (`${props.width}px`)};
  background-color: ${palette('black', 0)};
  /* background-color: #37C5B9; */
  align-items: center;
  overflow-y: auto;
  border-right: 1px solid;
  border-radius: 12px;
  z-index: 2;
`;

const MenuWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
    display: flex;
    flex-direction: row;
    flex: 1;
  }
`;
const LogoWrapper = styled(Link)`
  padding: 15px;
  background-color: ${palette('white', 0)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuLink = styled(Link)`
  display: flex;
  border-radius: 12px;
  margin-left: 10px;
  margin-right: 10px;
  flex: 1;
  font-size: 14px;
  font-weight: 600; // semi-bold
  padding: 16px 0;
  align-items: center;
  color: ${palette('white', 0)};
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 8px 10px;
  border-left: 4px solid transparent;

  &.current-link,
  &:hover,
  &:focus {
    background-color: ${palette('black', 1)};
    text-decoration: none;
  }
`;

const LeftMenu = ({
  width,
  links,
  onClose,
}) => (
  <Wrapper width={width}>
    <LogoWrapper to="/">
      <div>logo</div>
    </LogoWrapper>
    <MenuWrapper>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <MenuLink
              to={link.href}
              className={(navData) => {
                if (navData.isActive) {
                  return 'current-link';
                }
                return null;
              }}
              label={link.label}
            >
              <Icon icon="leftMenuIcon" height={24} style={{ marginRight: 10 }} />
              {startCase(link.label)}
            </MenuLink>
          </li>
        ))}
      </ul>
      <div>
        <MenuLink
          to="/"
          onClick={() => {
            onClose();
            serviceWorkerRegistration.unregister()
              .then((unregResult) => {
                console.log(unregResult);
                // You can check if successful with Promise result 'unregResult'
                window.location.reload();
              });
          }}
        >Log Out
        </MenuLink>
      </div>

    </MenuWrapper>
  </Wrapper>
);

LeftMenu.defaultProps = {
  width: '250',
  links: [{
    label: 'Home',
    href: '/',
  }],
  onClose: () => {},
};

LeftMenu.propTypes = {
  width: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
  onClose: PropTypes.func,
};

export default LeftMenu;
