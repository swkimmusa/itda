import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { size } from 'styled-theme';

// import { IndexLink, Link } from 'react-router-dom';
import './style.scss';

// import Touchable from '../../atoms/Ripple/Touch';

const MyMenuContainer = styled.div`
  height: calc(100% - 60px) !important;
  top: ${(props) => (props.top ? `${props.top}px` : '0px')} !important;
  width: calc((100% - 250px) / 2) !important;
  max-width: 650px;

  @media (max-width: ${size('mobileBreakpoint')}){
    width: calc(100% / 2) !important;
    min-width: 275px;
  }
`;

class RightMenu extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.open !== nextProps.open) {
      document.getElementsByTagName('body')[0].className = nextProps.open ? 'no-scroll' : '';
    }
  }

  render() {
    const {
      open,
      onClose,
      children,
      top,
    } = this.props;

    // TODO may be able to optimize height calc like flipkart on touchmove
    return (
      <div className={classNames('right-menu', { open })} style={{ height: '100%' }}>
        <div
          role="button"
          tabIndex={0}
          className="right-overlay"
          onKeyPress={onClose}
          onClick={onClose}
        />
        <MyMenuContainer className="right-menu-container" top={top}>
          {children}
        </MyMenuContainer>
      </div>
    );
  }
}

RightMenu.defaultProps = {
  onClose: () => {},
};

RightMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RightMenu;
