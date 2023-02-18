import { css } from 'styled-components';

export const unsetStyle = css`
  display: flex;
  text-decoration: none;
  appearance: none;
  cursor: pointer;
  border: none;
  background: none;

  &:focus {
    outline: none;
  }
`;

const defaultStyle = css`
  ${unsetStyle}
`;

export default defaultStyle;
