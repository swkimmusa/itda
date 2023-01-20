import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { size } from 'styled-theme';

// import { IndexLink, Link } from 'react-router-dom';
import './style.scss';

// import Touchable from '../../atoms/Ripple/Touch';

const MyMenuContainer = styled.div`
  height: 100% !important;
  @media (min-width: calc(${size('mobileBreakpoint')} + 1px)){
    &&.menu-container{
      left: 250px;
      position: relative;
    }
  }
`;

class LeftMenu extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      document.getElementsByTagName('body')[0].className = this.props.open ? 'no-scroll' : '';
    }
  }

  render() {
    const {
      open,
      onClose,
      children,
    } = this.props;

    // TODO may be able to optimize height calc like flipkart on touchmove
    return (
      <div className={classNames('left-menu', { open })} style={{ height: '100%' }}>
        <div
          role="button"
          tabIndex={0}
          className="overlay"
          onKeyPress={onClose}
          onClick={onClose}
        />
        <MyMenuContainer className="menu-container">
          {children}
        </MyMenuContainer>
      </div>
    );
  }
}

LeftMenu.defaultProps = {
  onClose: () => {},
  open: false,
  children: null,
};

LeftMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default LeftMenu;
