import {
  useParams, useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';

import { connect } from 'react-redux';
import {
  size, palette, font,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import { format } from 'number-currency-format';
import get from 'lodash/get';
import {
  formatCurrency,
  roundCurrency,
} from '../../services/formatCurrency';
import Flex from '../../components/atoms/Flex';
import Heading from '../../components/atoms/Heading';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/P';
import Label from '../../components/atoms/Label';
import Link from '../../components/atoms/Link';
import Input from '../../components/molecules/Input';
import IconText from '../../components/molecules/IconText';
import PageAction from '../../components/organisms/PageAction';
import InfoCard from '../../components/molecules/InfoCard';
import { annualCalc } from '../../services/calculator';
import calcActions from '../../store/calculation/actions';

const Wrapper = styled(Flex)`
  flex-direction: column;
  padding: 15px;
  padding-bottom: 200px;
`;

const SectionWrapper = styled(Flex)`
  flex-direction: column;
  margin-bottom: 40px;
  display: ${ifProp('hidden', 'none')};
`;

const HeaderContainer = styled(Flex)`
  flex-direction: row;
  margin-top: 40px;
  flex-wrap: wrap;
  font-size: 26px;
  line-height: 32px;
  color: ${palette('black', 0)};
`;

const Section = styled(Flex)`
  margin-top: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const CardHeaderContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledInfoCard = styled(InfoCard)`
  margin-top: 10px;
`;

const HeaderValue = styled.span`
  font-weight: 700;
  color: ${palette('black', 0)};
  position: relative;
  white-space: nowrap;
  ::after {

    content: '';
    position: absolute;
    bottom: 0%;
    left: 0;
    height: 8px;
    width: 100%;
    background: ${palette('primary', 1)};
    z-index: -1;
  }
`;

const StyledIconText = styled(IconText)`
  position: relative;
  white-space: nowrap;
  ::after {

    content: '';
    position: absolute;
    bottom: 0%;
    left: 0;
    height: 8px;
    width: 100%;
    background: ${palette('grayscale', 1)};
    z-index: -1;
  }
`;

const conversionLabels = {
  weekly: '주급',
  monthly: '월급',
  annual: '연봉',
};
const ResultView = (props) => {
  const { calculationList } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const currentInputValues = calculationList[id];
  const currentCalculation = annualCalc(currentInputValues);
  const { result } = currentCalculation;
  const isEdit = !!id;
  console.log(result);
  return (
    <Wrapper>
      <SectionWrapper>

        <HeaderContainer>
          <StyledIconText
            onClick={() => navigate(`/annual/calc/${id}`, { replace: false })}
            style={{
              display: 'inline',
              fontSize: 26,
            }}
          >
            {currentInputValues.name}
          </StyledIconText>
          <span>의 예상 실수령액은</span>
          &nbsp;
          <HeaderValue>
            {formatCurrency((result.monthlyNetSalary) * (result.conversionType === 'annual' ? 12 : 1))}
          </HeaderValue>
          &nbsp;
          <span>
            입니다
          </span>
        </HeaderContainer>
      </SectionWrapper>
      <SectionWrapper>
        <CardHeaderContainer>
          <Heading level={3} palette="black">정보</Heading>
        </CardHeaderContainer>
        <StyledInfoCard
          info={[
            {
              label: result.conversionType === 'annual' ? '연봉' : '월급',
              value: formatCurrency(result.salary),
              valueStyle: { fontWeight: 'bold' },
            },
            {
              label: '부양 가족 수',
              value: `${result.numOfFamily}명`,
            },
            {
              label: '20세 이하 자녀 수',
              value: `${result.numOfFamilyUnderAge}명`,
            },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper hidden={result.conversionType === 'annual'}>
        <Heading level={3} palette="black">추가 수당</Heading>
        <StyledInfoCard
          info={[
            {
              label: '통상임금(시)',
              value: formatCurrency(result.ordinaryHourlySalary),
            },
            {
              label: `연장근로 - ${result.overtimeWorkHours}시간`,
              value: formatCurrency(result.overtimeWorkWage),
            },
            {
              label: `야간근로 - ${result.nightTimeWorkHours}시간`,
              value: formatCurrency(result.nightTimeWorkWage),
            },
            {
              label: `휴일근로 - ${result.holidayWorkHours}시간`,
              value: formatCurrency(result.holidayWorkWage),
            },
            {
              label: `휴일연장근로 - ${result.holidayOvertimeWorkHours}시간`,
              value: formatCurrency(result.holidayOvertimeWorkWage),
            },
            {
              label: '총 추가 수당',
              value: formatCurrency(
                result.overtimeWorkWage
                + result.nightTimeWorkWage
                + result.holidayWorkWage
                + result.holidayOvertimeWorkWage,
              ),
              labelStyle: { fontWeight: 'bold' },
              valueStyle: { fontWeight: 'bold' },
            },
          ]}
        />
      </SectionWrapper>

      <SectionWrapper>
        <Heading level={3} palette="black">4대보험</Heading>
        <StyledInfoCard
          info={[
            {
              label: '국민연금',
              value: formatCurrency(result.nationalPension),
            },
            {
              label: '건강보험',
              value: formatCurrency(result.healthInsurance),
            },
            {
              label: '장기요양',
              value: formatCurrency(result.longTermHealthInsurance),
            },
            {
              label: '고용보험',
              value: formatCurrency(result.employmentInsurance),
            },
            {
              label: '근로소득세',
              value: formatCurrency(result.earnedIncomeTax),
            },
            {
              label: '주민세',
              value: formatCurrency(result.residentTax),
            },
            {
              label: '공제액 합계',
              value: formatCurrency(
                result.nationalPension
                + result.healthInsurance
                + result.longTermHealthInsurance
                + result.employmentInsurance,
              ),
              labelStyle: { fontWeight: 'bold' },
              valueStyle: { fontWeight: 'bold' },
            },
          ]}
        />
      </SectionWrapper>

      <SectionWrapper>
        <Heading level={3} palette="black">급여 정보</Heading>
        <StyledInfoCard
          info={[
            {
              label: '환산기준',
              value: conversionLabels[result.conversionType],
            },
            {
              label: '공제액 합계',
              value: formatCurrency(result.totalInsurance),
            },
            {
              label: '예상 실수령액 (월)',
              value: formatCurrency(roundCurrency(result.monthlyNetSalary)),
              valueStyle: { fontWeight: 'bold' },
            },
            {
              label: '예상 실수령액 (연)',
              value: formatCurrency(
                roundCurrency(result.monthlyNetSalary)
                * 12,
              ),
              valueStyle: { fontWeight: 'bold' },
            },
          ]}
        />
      </SectionWrapper>

      <PageAction actions={[]}>
        <Button label="계산 내역으로" to="/history" />
        <Button
          transparent
          label="계산 결과 삭제"
          style={{ marginTop: 15 }}
          onClick={() => {
            calcActions.deleteCalc(id);
            return navigate('/history?tab=annual');
          }}
        />
      </PageAction>
    </Wrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: null,
  calculationList: state.calculation.list,
});

export default connect(mapStateToProps)(ResultView);
