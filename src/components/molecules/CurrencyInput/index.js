import {
  useEffect, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
// import { InputNumber } from 'antd';
import {
  numToKorean, FormatOptions,
} from 'num-to-korean';
import { isNaN } from 'lodash';
import { format } from 'number-currency-format';
import { ifProp } from 'styled-tools';
import BaseInput from '../Input/BaseInput';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';
import ButtonRadio from '../ButtonRadio';
import Text from '../../atoms/P';

import { formatNumber } from '../../../services/formatCurrency';

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

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  width: 100%;
`;
const InputContainer = styled(Flex)`
  flex: 1;
  width: 100%;
  position: relative;
`;
const Suffix = styled(Text)`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  top: 0;
  right: 20px;
  font-right: 18px;
  pointer-events: none;
`;
const FormattedValue = styled(Text)`
  margin-top: 7px;
  text-align: right;
  pointer-events: none;
`;
const StyledBaseInput = styled(BaseInput)`
  text-align: right;
  padding-right: 48px;



  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
`;
const LabelWrapper = styled(Flex)`
  left: 8px;
  margin-bottom: 20px;
  font-family: ${font('primary')};
  font-size: 18px;
`;
const Label = styled(Text)`
  color: ${ifProp('disabled', palette('grayscale', 4), palette('black', 0))};
  margin-right: 8px;
`;
const RequiredText = styled(Text)`
  color: ${palette('primary', 0)};
  white-space: nowrap;
`;

const unformat = (str) => {
  const string = String(str).split(',').join('');
  console.log('string: ', string);
  return Number(String(str).split(',').join(''));
};

const ButtonsContainer = styled(Flex)`
  flex-direction: row;
  margin: 16px -5px 0px -5px;
`;
const AddButton = styled(Button)`
  border-color: ${palette('grayscale', 1)};
  border-width: 1px;
  padding: 8px 32px;
  margin: 0px 5px;
  flex: 1;
`;

const CurrencyInput = ({ ...props }) => {
  const {
    onChange,
    value,
    setFieldValue,
    setMetaValue,
    quickAddValueList,
    ...others
  } = props;
  // const inputRef = useRef(null);
  // const oldCursorRef = useRef(null);
  // const oldValueRef = useRef(null);

  useEffect(() => {
    // console.log('EFFECT');
    // const input = inputRef.current;
    // const oldValue = oldValueRef.current;
    // const caret = oldCursorRef.current;

    // if (!input) return;

    // const shouldAdd = String(value).length > String(oldValue).length;
    // const adjustment = Math.max(0, Math.floor((caret - 1) / 3));
    // console.log('caret: ', caret);
    // console.log('oldValue: ', oldValue);
    // console.log('value: ', value);
    // console.log('shouldAdd: ', shouldAdd);
    // console.log('adjustment: ', adjustment);
    // const adjustedCaret = shouldAdd ? caret + adjustment : caret - adjustment;
    // console.log('adjustedCaret: ', adjustedCaret);
    // input.selectionStart = adjustedCaret;
    // input.selectionEnd = adjustedCaret;
  }, [value]);
  // const formattedValue = formatNumber(unformat(value));
  // console.log('formattedValue: ', formattedValue);
  const koreanFormat = numToKorean(value, 'mixed');
  console.log('koreanFormat: ', value);
  console.log('value: ', value);

  return (
    <Wrapper {...others}>
      <InputContainer>
        <StyledBaseInput
          {...others}
          type="number"
          value={value}
          onChange={onChange}
          // onChange={(e) => {
          //   // e.target.value = '10';
          //   const unformattedValue = unformat(e.target.value);
          //   if (value === unformattedValue) return;

          //   inputRef.current = e.target;
          //   console.log('e.target.selectionStart: ', e.target.selectionStart);
          //   oldCursorRef.current = e.target.selectionStart;
          //   oldValueRef.current = value;
          //   if (isNaN(unformattedValue)) {
          //     e.stopPropagation();
          //     e.preventDefault();
          //     return;
          //   }
          //   setMetaValue(e.target.value);
          //   // e.target.value = unformattedValue;
          //   // setFieldValue(e);
          // }}
          // value={value}
          // inputMode="number"
          // value={formattedValue}
          // onChange={(e) => {
          //   onChange(e.target.value);
          // }}
        />
        <Suffix>원</Suffix>
      </InputContainer>
      <FormattedValue>{`${koreanFormat} 원`}</FormattedValue>
      <ButtonsContainer>
        {quickAddValueList.map((addValue) => {
          return (
            <AddButton
              transparent
              key={addValue}
              onClick={() => setMetaValue(value + addValue)}
              label={`+ ${format(addValue, { showDecimals: 'never' })}`}
            />
          );
        })}
      </ButtonsContainer>
    </Wrapper>
  );
};
console.log(unformat('3,43'));
CurrencyInput.propTypes = {
  type: PropTypes.string,
  reverse: PropTypes.bool,
  invalid: PropTypes.bool,
  label: PropTypes.string,
  quickAddValueList: PropTypes.arrayOf(PropTypes.number),
};

CurrencyInput.defaultProps = {
  type: 'text',
  quickAddValueList: [
    1000,
    5000,
    10000,
  ],
};

export default CurrencyInput;
