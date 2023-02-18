import { css } from 'styled-components';

export const unsetStyle = css`
  text-decoration: none;
  appearance: none;

  &:focus {
    outline: none;
  }
`;

const defaultStyle = css`
  ${unsetStyle}
`;

export default defaultStyle;
