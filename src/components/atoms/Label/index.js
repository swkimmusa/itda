import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  font, palette,
} from 'styled-theme';

const Label = styled.label`
  font-family: ${font('primary')};
  color: ${palette({ black: 0 }, 0)};
  font-size: 18px;
  font-weight: 500; // medium
  line-height: 24px;
`;

Label.propTypes = { palette: PropTypes.string };

Label.defaultProps = { palette: 'black' };

export default Label;
