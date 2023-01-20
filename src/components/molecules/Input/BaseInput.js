import styled, { css } from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import { ifProp } from 'styled-tools';

const borderColor = ({
  disabled,
  invalid,
}) => {
  if (disabled) return palette('grayscale', 3);
  if (invalid) return palette('red', 0);
  return palette('grayscale', 3);
};

const styles = css`
  font-family: ${font('primary')};
  font-size: 16px;
  width: 100%;
  ${ifProp(
    { type: 'textarea' },
    css`
      height: auto;
    `,
    css`
      min-height: 24px;
    `,
  )};
  ${ifProp(
    { type: 'textarea' },
    css`
      min-height: 24px;
    `,
  )} padding: ${ifProp({ type: 'textarea' }, '8px', '0 8px')};
  box-sizing: border-box;
  color: ${ifProp('disabled', palette('grayscale', 0), palette('black', 0))};
  background-color: ${ifProp('disabled', palette('grayscale', 0), palette('grayscale', 2))};
  border: 2px solid ${borderColor};
  border-radius: 12px;
  padding: 16px 20px;
  outline: none;

  &[type='checkbox'],
  &[type='radio'] {
    display: inline-block;
    border: 0;
    border-radius: 0;
    width: auto;
    height: auto;
    margin: 0 8px 0 0;
  }

  &::placeholder {
    color: ${palette('grayscale', 0)};
  }

  &:focus {
    border-color: ${palette('primary', 0)};
  }
`;

const StyledInput = styled.input`
  ${styles};
`;

export default StyledInput;
export { styles };
