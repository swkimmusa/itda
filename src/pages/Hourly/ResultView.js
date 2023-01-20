import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  size, palette, font,
} from 'styled-theme';
import { ifProp } from 'styled-tools';

import get from 'lodash/get';
import Flex from '../../components/atoms/Flex';
import Heading from '../../components/atoms/Heading';
import Button from '../../components/atoms/Button';
import Label from '../../components/atoms/Label';
import Input from '../../components/molecules/Input';
import PageAction from '../../components/organisms/PageAction';
import InfoCard from '../../components/molecules/InfoCard';
import { hourlyCalc } from '../../services/calculator';

const Wrapper = styled(Flex)`
  flex-direction: column;
  padding: 15px;
  padding-bottom: 200px;
`;

const SectionWrapper = styled(Flex)`
  flex-direction: column;
  margin-bottom: 40px;
`;

const Section = styled(Flex)`
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

const StyledButton = styled(Button)`
  width: 50%;
  min-width: 180px;
  margin: 20px 0px 20px;
  border-radius: 0px;

  @media (max-width: ${size('mobileBreakpoint')}){
    width: 100%;
  }
`;

const DashedButton = styled(Button)`
  border: 1px dashed ${palette('grayscale', 3)};
  background-color: ${ifProp('disabled', '#CCCCCC', palette('white', 0))};
  color: ${palette('black', 0)};
  border-radius: 4px;
  margin-top: 5px;
  width: 100%;
  padding: 0px;

  &:hover,
  &:focus,
  &:active {
    background-color: ${palette('white', 0)};
    color: ${palette('black', 0)};
  }
`;

const StyledInfoCard = styled(InfoCard)`
  margin-top: 10px;
`;

const ResultView = (props) => {
  const { calculationList } = props;
  const { id } = useParams();
  const currentInputValues = calculationList[id];
  const currentCalculation = hourlyCalc(currentInputValues);
  const { result } = currentCalculation;
  const isEdit = !!id;
  console.log(result);
  return (
    <Wrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">상세 정보</Heading>
        <StyledInfoCard
          info={[
            {
              label: '급여총액',
              value: result.basePay,
            },
            {
              label: '주휴수당',
              value: result.overtimePay,
            },
            {
              label: '입력정보 합계',
              value: result.totalPay,
            },
            {
              label: '4대보험',
              value: result.healthInsurance,
            },
            {
              label: '공제액 합계',
              value: result.healthInsurance,
              valueStyle: { fontWeight: 'bold' },
            },
            {
              label: '월 예상 실수령액',
              value: result.netPay,
              valueStyle: { fontWeight: 'bold' },
            },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">근무정보</Heading>
        <StyledInfoCard
          info={[
            { label: '근무시간' },
            { label: '근무인원' },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">급여 정보</Heading>
        <StyledInfoCard
          info={[
            { label: '환산기준' },
            { label: '급여' },
          ]}
        />
      </SectionWrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">근무시간 정보</Heading>
        <StyledInfoCard
          info={[{ label: '총 근무시간' }]}
        />
      </SectionWrapper>
      <PageAction actions={[]}>
        <Button label="계산 내역으로" to="/history" />
        <Button palette="grayscale" label="계산 결과 삭제" style={{ marginTop: 15 }} />
      </PageAction>
    </Wrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: null,
  calculationList: state.calculation.list,
});

export default connect(mapStateToProps)(ResultView);
