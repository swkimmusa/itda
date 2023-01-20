import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  font, palette,
} from 'styled-theme';

const P = styled.p`
  font-family: ${(props) => (props.fontFamily ? props.fontFamily : font('primary'))};
  color: ${(props) => (props.color ? props.color : palette({ grayscale: 0 }, 0))};
  margin-top: 0px; /* 0rem */
  margin-bottom: 0px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;
`;

P.propTypes = {
  reverse: PropTypes.bool,
  palette: PropTypes.string,
};

P.defaultProps = { palette: 'grayscale' };

export default P;
