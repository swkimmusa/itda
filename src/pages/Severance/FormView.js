import { useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  size,
  font,
  palette,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import {
  Formik, Form, useField, useFormikContext,
} from 'formik';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import useQueryParams from '../../hooks/useQueryParams';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/P';
import Input from '../../components/molecules/Input';
import IconText from '../../components/molecules/IconText';
import InlineModal from '../../components/molecules/InLineModal';

import ProgressBar from '../../components/molecules/ProgressBar';
import WeeklyHoursSelect from '../../components/molecules/WeeklyHoursSelect';

import PageAction from '../../components/organisms/PageAction';

import calcActions from '../../store/calculation/actions';
import { severanceCalc } from '../../services/calculator';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: 100%;
`;

const SectionWrapper = styled(Flex)`
  padding: 15px;
  flex-direction: column;
`;

const FieldFlex = styled(Flex)`
  align-items: center;
  @media (max-width: ${size('mobileBreakpoint')}){
    flex-direction: column;
    align-items: flex-start;
    padding-top: 5px;
  }
`;
const FieldSection = styled(Flex)`
  flex-direction: column;
  margin-top: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const StyledText = styled.div`
  padding: 10px 15px 22px 0px;
  width: 200px;
  text-align: right;
  font-family: ${font('tertiary')};
  font-weight: bold;

  @media (max-width: ${size('mobileBreakpoint')}){
    text-align: left;
    padding: 0px;
    width: auto;
  }
`;

const StyledInput = styled(Input)`
  ${ifProp('hidden', css`
    display: none;
  `)}
`;

const FieldComponent = (props) => {
  const {
    values,
    setFieldValue,
  } = useFormikContext();
  const [
    field,
    meta,
    helpers,
  ] = useField(props.name);
  const { value } = meta;
  const { setValue } = helpers;
  const {
    mapInputValuesToProps,
    InputComponent = StyledInput,
    ...otherProps
  } = props;
  console.log(field);

  const isCustomInput = InputComponent !== StyledInput;

  const mappedProps = mapInputValuesToProps(values);
  console.log('field: ', field);

  return (
    <InputComponent
      {...otherProps}
      {...mappedProps}
      {...field}
      metaValue={value}
      setMetaValue={setValue}
      {...(isCustomInput ? {
        value,
        onChange: setValue,
      } : {})}
    />
  );
};

FieldComponent.defaultProps = { mapInputValuesToProps: (v) => console.log('FieldComponent mapInputValuesToProps() ', v) };

const Step = ({
  step,
  currentStep,
  ...others
}) => {
  if (step !== currentStep) {
    return null;
  }
  return (
    <Flex {...others} style={{ flexDirection: 'column' }} />
  );
};

const StyledForm = styled(Form)`
  @media (max-width: ${size('mobileBreakpoint')}) {
    padding-bottom: 120px;
  }
`;

const StyledButton = styled(Button)`
  display: ${ifProp('hidden', 'none', 'flex')};
`;

const ProgressText = styled(Text)`
  color: ${palette('grayscale', 0)};
  font-size: 14px;
  margin-bottom: 6px;
`;

const getDefaultInitialValues = () => ({
  type: 'severance',
  smallBusiness: true,
  annualBonus: 0,
  annualTotalAddedWage: 0,
});
const FormView = (props) => {
  const { calculationList } = props;

  const navigate = useNavigate();
  const { id } = useParams();
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams(
    { initialQueryParams: { step: 0 } },
  );
  const step = Number(queryParams.step);

  const isEdit = !!id && id !== 'new';
  const inputValues = calculationList[id];

  const initialValues = isEdit
    ? {
      ...getDefaultInitialValues(),
      ...inputValues,
    }
    : getDefaultInitialValues();

  const next = () => {
    if (step < 2) {
      setQueryParams((query) => ({
        ...query,
        step: step + 1,
      }));
    }
  };
  const prev = () => {
    if (step > 0) {
      setQueryParams((query) => ({
        ...query,
        step: step - 1,
      }));
    }
  };

  return (
    <Wrapper>
      <ProgressText>내역은 자동저장되니 걱정마세요.</ProgressText>
      <ProgressBar percentage={(step / 2) * 100} />
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          if (step < 2) return;
          await new Promise((r) => setTimeout(r, 500));

          const calc = severanceCalc(values);

          const newId = isEdit ? id : uuidv4();
          calcActions.setCalc(calc.inputValues, newId);
          navigate(`/severance/result/${newId}`);
        }}
      >
        <StyledForm>
          <Step step={0} currentStep={step}>
            <FieldSection>
              <FieldComponent
                name="name"
                placeholder="퇴직금계산 이름"
                label="해당 계산 이름을 설정해주세요."
                required
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                required
                name="joinDate"
                type="date"
                label="입사일을 입력해 주세요."
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                required
                name="leaveDate"
                type="date"
                label="퇴직일을 입력해 주세요."
              />
              <InlineModal showOnce>퇴직일은 마지막 근무일입니다.</InlineModal>
            </FieldSection>
          </Step>
          <Step step={1} currentStep={step}>
            <FieldSection>
              <FieldComponent
                required
                name="monthlySalary"
                type="won"
                label="월급을 입력해 주세요."
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                required
                name="annualBonus"
                type="number"
                label="연간 상여금을 입력해 주세요."
              />
              <InlineModal showOnce>퇴직일 기준으로 1년간 받은 상여금과 인센티브.</InlineModal>
            </FieldSection>
            <FieldSection>
              <FieldComponent
                required
                name="annualTotalAddedWage"
                type="number"
                label="연차 수당을 입력해 주세요."
              />
            </FieldSection>
          </Step>
          <Step step={2} currentStep={step}>
            <FieldSection>
              <FieldComponent
                name="contractWeeklyHours"
                placeholder="근무 시간"
                label="근로계약서 상 1주 근무시간을 입력해 주세요."
                type="number"
              />
              <InlineModal showOnce>근로계약서상 명시한 근로시간이 1주 15시간 미만 -> 주휴수당 미발생, 국민연금/건강보험 적용제외, 주휴수당 등을 적용하고 싶지 않은 경우, 아래 2가지 사유에 해당하는 경우 "X"로 입력하고 계산하도록 안내</InlineModal>
            </FieldSection>
          </Step>
          <PageAction actions={[]}>
            <StyledButton transparent label="이전" onClick={prev} hidden={step === 0} style={{ marginBottom: 12 }} />
            <StyledButton label="다음" onClick={next} hidden={step >= 2} />
            <StyledButton type="submit" label="계산" hidden={step < 2} />
          </PageAction>
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: null,
  calculationList: state.calculation.list,
});
// const mapDispatchToProps = (dispatch) => ({ setListAction: (v) => dispatch(v) });
export default connect(mapStateToProps)(FormView);
