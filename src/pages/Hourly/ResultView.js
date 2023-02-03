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
  formatNumber, formatCurrency,
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
import { hourlyCalc } from '../../services/calculator';
import calcActions from '../../store/calculation/actions';

const Wrapper = styled(Flex)`
  flex-direction: column;
  padding: 15px;
  padding-bottom: 200px;
`;

const SectionWrapper = styled(Flex)`
  flex-direction: column;
  margin-bottom: 40px;
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
};
const ResultView = (props) => {
  const { calculationList } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const currentInputValues = calculationList[id];
  const currentCalculation = hourlyCalc(currentInputValues);
  const { result } = currentCalculation;
  const isEdit = !!id;
  console.log(result);
  return (
    <Wrapper>
      <SectionWrapper>

        <HeaderContainer>
          <StyledIconText
            onClick={() => navigate(`/hourly/calc/${id}`, { replace: false })}
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
            {formatCurrency(result.netWage)}
          </HeaderValue>
          &nbsp;
          <span>
            입니다
          </span>
        </HeaderContainer>
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">상세 정보</Heading>
        <StyledInfoCard
          info={[
            {
              label: '기본급',
              value: formatCurrency(result.baseWage),
            },
            {
              label: '주휴수당',
              value: formatCurrency(result.weeklyHolidayWage),
            },
            {
              label: '연장근로수당',
              value: formatCurrency(result.overtimeWage),
            },
            // {
            //   label: '월 급여',
            //   value: result.totalWage,
            // },
            {
              label: '고용보험',
              value: formatCurrency(result.employmentInsurance),
            },
            {
              label: '공제액 합계',
              value: formatCurrency(result.employmentInsurance),
              valueStyle: { fontWeight: 'bold' },
            },
            {
              label: '월 급여',
              value: formatCurrency(result.netWage),
              valueStyle: { fontWeight: 'bold' },
            },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <CardHeaderContainer>
          <Heading level={3} palette="black">근무정보</Heading>
        </CardHeaderContainer>
        <StyledInfoCard
          info={[
            {
              label: '근무시간',
              value: result.hoursWorked,
            },
            {
              label: '상시 근무인원',
              value: result.smallBusiness ? '5인 미만' : '5인 이상', // 5인 이상 , 5인 미만
            },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <CardHeaderContainer>
          <Heading level={3} palette="black">공제정보</Heading>
        </CardHeaderContainer>
        <StyledInfoCard
          info={[
            {
              label: '고용보험',
              // value: result.employ,
            },
            {
              label: '상시 근무인원',
              // value: result.smallBusiness ? '5인 미만' : '5인 이상', // 5인 이상 , 5인 미만
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
              label: '급여',
              value: `${result.type} ${formatCurrency(result.hourlyWage)}`,
            },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">근무시간 정보</Heading>
        <StyledInfoCard
          info={[{
            label: '총 근무시간',
            value: result.hoursWorked,
          }]}
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
            return navigate('/history?tab=hourly');
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
