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
import { annualCalc } from '../../services/calculator';

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
  display: ${ifProp('hidden', 'none')};
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
  type: 'annual',
  conversionType: 'annual',
  name: '',
  numOfFamily: 1,
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
          console.log('step: ', step);
          console.log('step: ', step < 1);
          if (step < 1) return;
          await new Promise((r) => setTimeout(r, 500));

          const calc = annualCalc(values);
          alert(JSON.stringify(calc, null, 2));

          const newId = isEdit ? id : uuidv4();
          console.log('isEdit: ', isEdit);
          console.log('newId: ', newId);
          calcActions.setCalc(calc.inputValues, newId);
          navigate(`/annual/result/${newId}`);
        }}
      >
        <StyledForm>
          <Step step={0} currentStep={step}>
            <FieldSection>
              <FieldComponent
                name="name"
                placeholder="연봉계산 이름"
                label="해당 계산 이름을 설정해주세요."
                required
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                required
                name="conversionType"
                type="buttonSelect"
                label="현재 급여를 입력해 주세요."
                // buttonStyle={{
                //   paddingTop: 18,
                //   paddingBottom: 18,
                //   flex: 1,
                // }}
                options={[
                  {
                    label: '연봉',
                    value: 'annual',
                  },
                  {
                    label: '월급',
                    value: 'monthly',
                  },
                ]}
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                name="salary"
                type="won"
              />
            </FieldSection>
          </Step>
          <Step step={1} currentStep={step}>
            <FieldSection>
              <FieldComponent
                name="nonTaxableIncome"
                placeholder={0}
                label="비과세액을 입력해 주세요"
                type="number"
              />
              <InlineModal showOnce>
                대표적인 비과세항목인 식대는
                월 10만원까지 비과세입니다.
                그 외에 비과세 항목은 급여명세서를
                통해서 확인할 수 있습니다.
              </InlineModal>

            </FieldSection>
            <FieldSection>
              <FieldComponent
                name="numOfFamily"
                placeholder={0}
                min={1}
                label="본인 포함 부양가족 수를 입력해 주세요"
                type="number"
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                name="numOfFamilyUnderAge"
                placeholder={0}
                label="20세 이하 자녀 수를 입력해 주세요"
                type="number"
              />
            </FieldSection>
          </Step>
          <Step step={2} currentStep={step}>
            <FieldSection>
              <FieldComponent
                name="overtimeWorkHours"
                placeholder={0}
                label="연장근로시간을 입력해주세요"
                type="number"
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                name="nightTimeWorkHours"
                placeholder={0}
                label="야간근로시간을 입력해주세요"
                type="number"
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                name="holidayWorkHours"
                placeholder={0}
                label="휴일근로시간을 입력해주세요"
                type="number"
              />
            </FieldSection>
            <FieldSection>
              <FieldComponent
                name="holidayOvertimeWorkHours"
                placeholder={0}
                label="휴일연장근로시간을 입력해주세요"
                type="number"
              />
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

// if (type === 'dayOfWeek') {
//   return (
//     <Wrapper {...props}>
//       {label ? (
//         <LabelWrapper>
//           {label}
//           {!required && <RequiredText>(선택)</RequiredText>}
//         </LabelWrapper>
//       ) : null}
//       <DayOfWeekSelect
//         {...props}
//         onSelect={(v) => props.setMetaValue(v)}
//         selected={props.metaValue}
//       />
//     </Wrapper>
//   );
// }

const mapStateToProps = (state, ownProps) => ({
  user: null,
  calculationList: state.calculation.list,
});
// const mapDispatchToProps = (dispatch) => ({ setListAction: (v) => dispatch(v) });
export default connect(mapStateToProps)(FormView);
