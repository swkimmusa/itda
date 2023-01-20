import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import Flex from '../../atoms/Flex';
import ButtonRadio from '../ButtonRadio';

const borderColor = ({
  disabled,
  invalid,
}) => {
  if (disabled) return palette('grayscale', 3);
  if (invalid) return palette('red', 0);
  return palette('grayscale', 3);
};

const hoverBorderColor = ({ disabled }) => {
  return disabled ? palette('grayscale', 0) : palette('primary', 0);
};

const checkBorderColor = ({ disabled }) => {
  return disabled ? palette('grayscale', 0) : palette('primary', 0);
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

const Wrapper = styled.label`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  vertical-align: middle;
  justify-content: center;
  position: relative;
  margin-right: 8px;
  margin-bottom: 0rem;
  user-select: none;
  /* & > [type='checkbox'], */
  & > [type='radio'] {
    position: absolute;
    opacity: 0;
  }
  & > .check {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 0.0625rem solid; // 1px
    border-color: ${borderColor};
    background-color: ${palette('white', 0)};
    border-radius: ${ifProp({ type: 'checkbox' }, '0.125rem', '100%')};
    height: 14px;
    width: 14px;
    &:hover {
      border-color: ${hoverBorderColor};
    }
    ${ifProp(
    { type: 'checkbox' },
    css`
        // checkbox
        & > svg {
          fill: none;
          stroke: none;
        }
      `,
    css`
        // radio
        &::before {
          display: block;
          content: '';
          border-radius: 100%;
          height: 8px;
          width: 8px;
          margin: auto;
        }
      `,
  )};
  }

  /* CHECK STATE */
  /* & > [type='checkbox']:checked ~ .check, */
  & > [type='radio']:checked ~ .check {
    border-color: ${checkBorderColor};
    ${ifProp(
    { type: 'checkbox' },
    css`
        // checkbox
        background-color: ${ifProp('disabled', palette('white', 0), palette('primary', 3))};
        background-color:#37C5B9;
        & > svg {
          stroke: ${ifProp('disabled', palette('grayscale', 4), palette('white', 0))};
        }
      `,
    css`
        // radio
        &::before {
          background-color: ${checkBorderColor};
        }
      `,
  )};
  }
`;

const StyledTextarea = styled.textarea`
  ${styles};
`;
const StyledInput = styled.input`
  ${styles};
`;
const LabelWrapper = styled(Flex)`
  left: 8px;
  margin-bottom: 20px;
  font-family: ${font('primary')};
  font-size: 18px;
  color: ${ifProp('disabled', palette('grayscale', 4), palette('black', 0))};
`;

const Input = ({ ...props }) => {
  const {
    type,
    label,
    inputStyle,
  } = props;
  if (type === 'textarea') {
    return <StyledTextarea {...props} style={inputStyle} />;
  }
  if (type === 'radio' || type === 'checkbox') {
    return (
      <Wrapper {...props}>
        {label && <LabelWrapper>{label}</LabelWrapper>}
        {type === 'checkbox' && <StyledInput {...props} style={inputStyle} />}
        {type !== 'checkbox' && <StyledInput {...props} style={inputStyle} />}
        {type === 'radio' && <span className="check" />}
      </Wrapper>
    );
  }
  if (type === 'buttonSelect') {
    return (
      <Wrapper {...props}>
        {label && <LabelWrapper>{label}</LabelWrapper>}
        <ButtonRadio
          {...props}
          onSelect={(v) => props.setMetaValue(v)}
          selected={props.metaValue}
        />
      </Wrapper>
    );
  }
  console.log(props);
  return (
    <Wrapper {...props}>
      {label && <LabelWrapper>{label}</LabelWrapper>}
      <StyledInput {...props} />
    </Wrapper>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  reverse: PropTypes.bool,
  invalid: PropTypes.bool,
  label: PropTypes.string,
};

Input.defaultProps = { type: 'text' };

export default Input;
