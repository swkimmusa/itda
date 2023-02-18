import { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
// import { Link } from 'react-router-dom';
import {
  palette, font,
} from 'styled-theme';
import {
  ifProp, switchProp, prop,
} from 'styled-tools';
import Spinner from '../Spinner';
import Link from '../Link';

import defaultStyle, { unsetStyle } from './style';

const backgroundColor = ({
  disabled,
  transparent,
  primary,
}) => {
  if (disabled) return palette('grayscale', 0);
  if (transparent) return 'transparent';
  return palette('primary', 0);
};

const foregroundColor = ({
  transparent,
  disabled,
}) => {
  if (transparent) {
    return disabled ? palette('grayscale', 3) : palette('grasyscale', 0);
  }
  return palette('white', 0);
};

const hoverBackgroundColor = ({
  disabled,
  transparent,
}) => !disabled && (transparent ? palette('white', 1) : palette(0));
const hoverForegroundColor = ({
  disabled,
  transparent,
}) => !disabled && transparent && palette(0);

const styles = css`
  ${defaultStyle}
  display: flex;
  text-align: center;
  font-family: ${font('secondary')};
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  border: 2px solid ${ifProp('transparent', 'transparent', 'transparent')};
  ${ifProp('borderColor', css`
    border-color: ${({ borderColor }) => borderColor};
  `)}
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
  cursor: ${ifProp('disabled', 'no-drop', 'pointer')};
  box-sizing: border-box;
  pointer-events: ${ifProp('disabled', 'none', 'auto')};
  transition: all 0.15s ease;
  background-color: ${backgroundColor};
  color: ${foregroundColor};

`;

const StyledLink = styled(
  // eslint-disable-next-line no-shadow
  ({
    disabled,
    transparent,
    reverse,
    palette,
    theme,
    ...props
  }) => <Link {...props} />,
)`
  ${styles};
`;
const Anchor = styled.a`
  ${styles};

`;
const StyledButton = styled.button`
  ${styles};
`;

const Button = ({
  type,
  isAsync,
  onClick,
  loaderStroke,
  label,
  children,
  ...props
}) => {
  const [
    loading,
    setLoading,
  ] = useState(false);

  if (props.to) {
    return <StyledLink {...props}>{label || children}</StyledLink>;
  }
  if (props.href) {
    return <Anchor {...props}>{label || children}</Anchor>;
  }

  const asyncOnClick = (...args) => {
    setLoading(true);
    if (loading) return null;
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 100);
    })
      .then(() => Promise.resolve(onClick(...args)))
      .then((result) => {
        setTimeout(() => {
          setLoading(false);
        }, 100);
        return result;
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  };

  const parsedOnClick = !isAsync ? onClick : asyncOnClick;

  return (
    <StyledButton
      {...props}
      onClick={parsedOnClick}
      type={type}
    >
      {loading
        ? <Spinner {...(loaderStroke ? { stroke: loaderStroke } : {})} />
        : (label || children)}
    </StyledButton>
  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  type: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
  label: PropTypes.string,
  palette: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  palette: 'primary',
  to: null,
  href: null,
  type: 'button',
  label: 'Button',
};

export default Button;
export {
  defaultStyle,
  unsetStyle,
};
