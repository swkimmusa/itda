import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import { NavLink } from 'react-router-dom';

const styles = css`
  font-family: ${font('primary')};
  text-decoration: none;
  color: ${ifProp({ disabled: true }, palette('grayscale', 4), palette(3))};
  transition: all 0.1s ease;
  cursor: ${ifProp({ disabled: true }, 'no-drop')};
  pointer-events: ${ifProp({ disabled: true }, 'none')};

  &:hover,
  &:focus {
    text-decoration: ${ifProp([
    { disabled: true },
    { disableStyle: true },
  ], 'none', 'underline')};
  }
`;

const StyledNavLink = styled(({
  theme,
  reverse,
  // palette,
  ...props
}) => <NavLink {...props} />)`
  ${styles};
`;

const Anchor = styled.a`
  ${styles};
`;

const Link = ({ ...props }) => {
  if (props.to) {
    return <StyledNavLink {...props} />;
  }
  return <Anchor {...props} />;
};

Link.propTypes = {
  disabled: PropTypes.bool,
  palette: PropTypes.string,
  reverse: PropTypes.bool,
  to: PropTypes.string,
};

Link.defaultProps = {
  palette: 'primary',
  disabled: false,
  reverse: false,
  to: '/',
};

export default Link;
