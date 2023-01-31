import { useState } from 'react';
import {
  useParams, useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import {
  size, palette, font,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import { format } from 'number-currency-format';
import get from 'lodash/get';
import moment from 'moment';
import {
  formatNumber, formatCurrency,
} from '../../services/formatCurrency';
import Flex from '../../components/atoms/Flex';
import Heading from '../../components/atoms/Heading';
import Button from '../../components/atoms/Button';
import ButtonRadio from '../../components/molecules/ButtonRadio';
import Text from '../../components/atoms/P';
import Label from '../../components/atoms/Label';
import Link from '../../components/atoms/Link';
import Input from '../../components/molecules/Input';
import IconText from '../../components/molecules/IconText';
import PageAction from '../../components/organisms/PageAction';
import InfoCard from '../../components/molecules/InfoCard';
import { severanceCalc } from '../../services/calculator';
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

const conversionLabels = {};
const ResultView = (props) => {
  const { calculationList } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const currentInputValues = calculationList[id];
  const currentCalculation = severanceCalc(currentInputValues);

  const { result } = currentCalculation;
  const {
    joinDate,
    leaveDate,
    ordinaryMonthlySalaryList,
    annualBonusSeverance,
    annualTotalAddedWageSeverance,
  } = result;
  console.log(result);
  const total = ordinaryMonthlySalaryList.reduce((ac, cu) => ac + cu.ordinarySalary, 0) + annualBonusSeverance + annualTotalAddedWageSeverance;
  const isEdit = !!id;
  return (
    <Wrapper>
      <SectionWrapper>

        <HeaderContainer>
          <StyledIconText
            onClick={() => navigate(`/severance/calc/${id}`, { replace: false })}
            style={{
              display: 'inline',
              fontSize: 26,
            }}
          >
            {currentInputValues.name}
          </StyledIconText>
          <span>의 예상 퇴직금은 </span>
          &nbsp;
          <HeaderValue>
            {formatCurrency(total)}
          </HeaderValue>
          &nbsp;
          <span>
            입니다
          </span>
        </HeaderContainer>
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">근무 정보</Heading>
        <StyledInfoCard
          info={[
            {
              label: '입사일',
              value: result.joinDate,
            },
            {
              label: '퇴사 기준일',
              value: result.leaveDate,
            },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">퇴직금 발생</Heading>
        <StyledInfoCard
          info={ordinaryMonthlySalaryList.map(({
            date,
            ordinarySalary,
          }) => {
            return {
              label: moment(date).format('YYYY-MMMM-Do'),
              value: ordinarySalary,
            };
          })}
        />
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">상여금 추가</Heading>
        <StyledInfoCard
          info={[
            {
              label: '상여금',
              value: result.annualBonusSeverance,
            },
            {
              label: '연차수당',
              value: result.annualTotalAddedWageSeverance,
            },
          ]}
        />
      </SectionWrapper>
      <PageAction actions={[]}>
        <Button label="계산 내역으로" to="/history?tab=severance" />
        <Button
          transparent
          label="계산 결과 삭제"
          style={{ marginTop: 15 }}
          onClick={() => {
            calcActions.deleteCalc(id);
            return navigate('/history?tab=severance');
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
