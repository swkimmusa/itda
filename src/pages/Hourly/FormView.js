import styled, { css } from 'styled-components';

import { connect } from 'react-redux';
import {
  size,
  font,
} from 'styled-theme';
import { ifProp } from 'styled-tools';

import {
  Formik, Form, useField, useFormikContext,
} from 'formik';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Input from '../../components/molecules/Input';
import PageAction from '../../components/organisms/PageAction';
import calcActions from '../../store/calculation/actions';
import { hourlyCalc } from '../../services/calculator';

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
    ...otherProps
  } = props;
  console.log(field);

  const mappedProps = mapInputValuesToProps(values);
  console.log('mappedProps: ', mappedProps);
  return (
    <StyledInput
      {...otherProps}
      {...mappedProps}
      {...field}
      metaValue={value}
      setMetaValue={setValue}
    />
  );
};

FieldComponent.defaultProps = { mapInputValuesToProps: (v) => console.log('FieldComponent mapInputValuesToProps() ', v) };

const StyledForm = styled(Form)`
  @media (max-width: ${size('mobileBreakpoint')}) {
    padding-bottom: 120px;
  }
`;
const getDefaultInitialValues = () => ({
  smallBusiness: false,
  consistentHours: true,
  conversionType: 'monthly',
});
const FormView = (props) => {
  const { calculationList } = props;
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id || id === 'new';
  const inputValues = calculationList[id];

  const initialValues = isEdit
    ? {
      ...getDefaultInitialValues(),
      ...inputValues,
    }
    : getDefaultInitialValues();
  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          const calc = hourlyCalc(values);
          alert(JSON.stringify(calc, null, 2));
          calcActions.setCalc(calc.inputValues, 'some-id');
          navigate('/hourly/result/some-id');
        }}
      >
        <StyledForm>
          <FieldSection>
            <FieldComponent
              name="name"
              placeholder="???????????? ??????"
              label="?????? ?????? ????????? ??????????????????."
              required
            />
          </FieldSection>
          <FieldSection>
            <FieldComponent
              name="consistentHours"
              type="buttonSelect"
              label="?????? ??????????????? ????????????????"
              buttonStyle={{
                paddingTop: 18,
                paddingBottom: 18,
                flex: 1,
              }}
              options={[
                {
                  label: '????????????',
                  value: true,
                },
                {
                  label: '?????? ????????????',
                  value: false,
                },
              ]}
            />
          </FieldSection>
          <FieldSection>
            <FieldComponent
              name="smallBusiness"
              type="buttonSelect"
              label="?????? 5??? ?????? ????????????????"
              buttonStyle={{
                paddingTop: 18,
                paddingBottom: 18,
                flex: 1,
              }}
              options={[
                {
                  label: '5??? ??????',
                  value: false,
                },
                {
                  label: '5??? ??????',
                  value: true,
                },
              ]}
            />
          </FieldSection>
          <FieldSection>
            <FieldComponent
              name="contractWeeklyHours"
              placeholder="?????? ??????"
              label="??????????????? ??? 1??? ??????????????? ????????? ?????????."
              type="number"
            />
          </FieldSection>
          <FieldSection>
            <FieldComponent
              name="conversionType"
              type="buttonSelect"
              label="?????? ????????? ????????? ?????????."
              buttonStyle={{
                paddingTop: 18,
                paddingBottom: 18,
                flex: 1,
              }}
              options={[
                {
                  label: '??????',
                  value: 'monthly',
                },
                {
                  label: '??????',
                  value: 'weekly',
                },
                {
                  label: '??????',
                  value: 'daily',
                },
              ]}
            />
          </FieldSection>
          <FieldSection>
            <FieldComponent
              name="hourlyWage"
              placeholder="9160"
              label="????????? ????????? ?????????."
              type="number"
            />
          </FieldSection>

          <FieldSection>
            <FieldComponent
              mapInputValuesToProps={({
                consistentHours,
                ...others
              }) => ({
                ...others,
                hidden: !consistentHours,
              })}
              name="hoursPerDay"
              placeholder="8"
              label="??? ????????????"
              type="number"
            />
          </FieldSection>

          <FieldSection>
            <FieldComponent
              mapInputValuesToProps={({
                consistentHours,
                ...others
              }) => ({
                ...others,
                hidden: !consistentHours,
              })}
              name="daysWorked"
              placeholder="8"
              label="????????????"
              type="number"
            />
          </FieldSection>

          <PageAction actions={[]}>
            <Button type="submit" label="??????" />
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
