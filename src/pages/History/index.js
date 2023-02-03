import { connect } from 'react-redux';
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
import Link from '../../components/atoms/Link';
import Button from '../../components/atoms/Button';
import CalcSummHeader from '../../components/molecules/CalcSummHeader';
import propTypes from '../../propTypes';
import Heading from '../../components/atoms/Heading';
import ButtonRadio from '../../components/molecules/ButtonRadio';
import PageAction from '../../components/organisms/PageAction';
import useQueryParams from '../../hooks/useQueryParams';
import calcActions from '../../store/calculation/actions';

import calc from '../../assets/image/calc.png';
import calendar from '../../assets/image/calendar.png';
import yearly from '../../assets/image/yearly.png';
import hourly from '../../assets/image/hourly.png';

import { hourlyCalc } from '../../services/calculator';

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

const History = ({
  calculationList,
  ...otherProps
}) => {
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams(
    { initialQueryParams: { tab: 'hourly' } },
  );
  console.log(calculationList);
  const { tab } = queryParams;
  const keys = Object.keys(calculationList);
  const filteredKeys = keys.filter((key) => calculationList[key].type === tab);
  console.log(keys);
  console.log(tab);
  console.log(filteredKeys);
  return (
    <Wrapper>
      <HeaderContainer>
        <Heading level={2} palette="black" style={{ marginTop: 40 }}>최근 계산 내역</Heading>
        <ButtonRadio
          style={{ marginTop: 20 }}
          highlight
          selected={tab}
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
              value: 'annual',
              label: '연봉',
            },
            {
              value: 'leave',
              label: '연차',
            },
            {
              value: 'severance',
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
            전체 {filteredKeys.length} 건
          </TotalText>
          <TotalCardSection>
            {filteredKeys.map((k) => {
              const currentCalculation = hourlyCalc(calculationList[k]);
              const { result } = currentCalculation;
              console.log(result);
              return (
                <Link to={`/${result.type || 'hourly'}/result/${k}`} key={k}>
                  <StyledCalcSummHeader
                    title={result.name}
                    hourly={result.hourlyWage}
                    type={result.conversionType}
                    beforeTax={result.totalWage}
                    afterTax={result.netWage}
                    onDelete={(e) => {
                      console.log('stopping prop');
                      e.preventDefault();
                      e.stopPropagation();

                      calcActions.deleteCalc(k);
                    }}
                    // beforeTax: 321000,
                    // afterTax: 321000,
                    // date: moment().toISOString(),
                  />
                </Link>
              );
            })}
          </TotalCardSection>
        </TotalSection>
      </SectionContainer>
      <PageAction
        actions={[{
          label: '계산하기',
          to: `/${tab}/calc/new`,
        }]}
      />
    </Wrapper>
  );
};

History.propTypes = { };

const mapStateToProps = (state, ownProps) => ({ calculationList: state.calculation.list });
// const mapDispatchToProps = (dispatch) => ({ setListAction: (v) => dispatch(v) });
export default connect(mapStateToProps)(History);
