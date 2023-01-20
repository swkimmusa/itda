// import { connect } from 'react-redux';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';
import styled from 'styled-components';
import {
  size, palette,
} from 'styled-theme';
// import Card from '../../components/atoms/Card';
import Text from '../../components/atoms/P';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import CalcSummHeader from '../../components/molecules/CalcSummHeader';
import propTypes from '../../propTypes';
import Heading from '../../components/atoms/Heading';
import ButtonRadio from '../../components/molecules/ButtonRadio';
import PageAction from '../../components/organisms/PageAction';
import useQueryParams from '../../hooks/useQueryParams';

import calc from '../../assets/image/calc.png';
import calendar from '../../assets/image/calendar.png';
import yearly from '../../assets/image/yearly.png';
import hourly from '../../assets/image/hourly.png';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  padding-bottom: 80px;
`;

const SectionContainer = styled(Flex)`
  flex-direction: column;
  padding: 15px;
`;

const HeaderContainer = styled(SectionContainer)`
  flex-direction: column;

`;
const TotalSection = styled(Flex)`
  flex-direction: column;
`;
const TotalText = styled(Text)`
  font-size: 14px;
`;
const TotalCardSection = styled(Flex)`
  flex-direction: column;
  margin-top: 5px;
`;
const StyledCalcSummHeader = styled(CalcSummHeader)`
  margin-top: 5px;
  margin-bottom: 5px;
`;
const HeaderText = styled(Heading)`
  color: white;
  margin-top: 75px;
  margin-right: 160px;
  max-width: 180px;
`;

const IconCardsContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  margin: -5px;
  flex-wrap: wrap;
  margin-top: -${15 + 40}px;
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 6px;

  p {
    color: red;
    font-size: 11px;
    margin: 0;
  }
`;

const History = ({}) => {
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams(
    { initialQueryParams: { tab: 'hourly' } },
  );

  return (
    <Wrapper>
      <HeaderContainer>
        <Heading level={2} palette="black" style={{ marginTop: 40 }}>최근 계산 내역</Heading>
        <ButtonRadio
          style={{ marginTop: 20 }}
          highlight
          selected={queryParams.tab}
          onSelect={(v) => setQueryParams((qp) => ({
            ...qp,
            tab: v,
          }))}
          options={[
            {
              value: 'hourly',
              label: '시급',
            },
            {
              value: 'yearly',
              label: '연봉',
            },
            {
              value: 'leave',
              label: '연차',
            },
            {
              value: 'severence',
              label: '퇴직금',
            },
          ]}
          buttonStyle={{
            paddingTop: 12,
            paddingBottom: 12,
          }}
        />
      </HeaderContainer>
      <SectionContainer>
        <TotalSection>
          <TotalText>
            전체 3 건
          </TotalText>
          <TotalCardSection>
            {[
              1,
              2,
              3,
            ].map((v) => (
              <StyledCalcSummHeader key={v} />
            ))}
          </TotalCardSection>
        </TotalSection>
      </SectionContainer>
      <PageAction
        actions={[{
          label: '계산하기',
          to: '/hourly/calc/new',
        }]}
      />
    </Wrapper>
  );
};

History.propTypes = { };

export default History;
