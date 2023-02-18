import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  font, palette,
} from 'styled-theme';
// import { InputNumber } from 'antd';
import { numToKorean } from 'num-to-korean';
import BaseInput from '../Input/BaseInput';
import Flex from '../../atoms/Flex';
import Button from '../../atoms/Button';
import Text from '../../atoms/P';

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

// const unformat = (str) => {
//   return Number(String(str).split(',').join(''));
// };

const ButtonsContainer = styled(Flex)`
  flex-direction: row;
  margin: 16px -5px 0px -5px;
  overflow: auto;
`;
const ButtonContainer = styled(Flex)`
  flex: 1;
  width: ${({ buttonCount }) => {
    if (!buttonCount) return 'auto';
    return `${Math.floor(100 / buttonCount)}%;`;
  }}
  padding: 0px 5px;
`;
const AddButton = styled(Button)`
  border-color: ${palette('grayscale', 1)};
  border-width: 1px;
  padding: 8px 16px;
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

  const koreanFormat = numToKorean(value, 'mixed');

  return (
    <Wrapper {...others}>
      <InputContainer>
        <StyledBaseInput
          {...others}
          type="number"
          value={value}
          onChange={onChange}
        />
        <Suffix>원</Suffix>
      </InputContainer>
      <FormattedValue>{`${koreanFormat} 원`}</FormattedValue>
      <ButtonsContainer>
        {quickAddValueList.map((addValue) => {
          return (
            <ButtonContainer
              buttonCount={quickAddValueList.length}
              key={addValue}
            >
              <AddButton
                transparent
                key={addValue}
                onClick={() => setMetaValue(value ? value + addValue : addValue)}
                // label={`+ ${format(addValue, { showDecimals: 'never' })}`}
                label={`+ ${numToKorean(addValue, 'mixed')}`}
              />
            </ButtonContainer>
          );
        })}
      </ButtonsContainer>
    </Wrapper>
  );
};
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
