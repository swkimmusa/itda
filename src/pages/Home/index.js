import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { get } from 'lodash';
import {
  size, palette,
} from 'styled-theme';
// import Card from '../../components/atoms/Card';
import P from '../../components/atoms/P';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import propTypes from '../../propTypes';
import Heading from '../../components/atoms/Heading';
import Link from '../../components/atoms/Link';
import IconCard from '../../components/molecules/IconCard';
import homebackground from '../../assets/image/home-background.png';

import calc from '../../assets/image/calc.png';
import calendar from '../../assets/image/calendar.png';
import yearly from '../../assets/image/yearly.png';
import hourly from '../../assets/image/hourly.png';
import CalcSummHeader from '../../components/molecules/CalcSummHeader';

import { hourlyCalc } from '../../services/calculator';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  background-color: ${palette('blue', 2)};
`;

const SectionContainer = styled(Flex)`
  padding: 15px;
`;

const HeaderContainer = styled(SectionContainer)`
  height: 340px;

  background-image: url(${homebackground});
  background-size: cover;
  background-position: center;
  border-radius: 0px 0px 12px 12px;
`;

const HeaderText = styled(Heading)`
  color: white;
  margin-top: 75px;
  margin-bottom: 100px;
  margin-right: 160px;
  max-width: 180px;
`;

const IconCardsContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  margin: -5px;
  flex-wrap: wrap;
  margin-top: -${15 + 40}px;
  flex: 1;
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

const StyledIconCardContainer = styled(Link)`
  margin: 5px;
  min-width: calc(50% - 10px);
`;
const StyledIconCard = styled(IconCard)`
  // margin: 5px;
  // min-width: calc(50% - 10px);
  align-items: center;
`;

const HistorySection = styled(SectionContainer)`
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  flex: 0;
`;

const HistoryCardSection = styled(Flex)`
  flex-direction: row;
  margin-top: 20px;
  flex-wrap: nowrap;
  overflow: auto;
  margin-left: -5px;
  margin-right: -5px;
`;
const StyledCalcSummHeader = styled(CalcSummHeader)`
  margin-left: 5px;
  margin-right: 5px;
`;

const Home = ({
  authenticated,
  // user,
  // role,
  // visited,
  calculationList,
  signInError,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('rendering home');
  const getDefaultPathName = () => {
    console.log('getting default path');
    // return different route to authenticated user
    return '/';
  };

  const { from } = location.state || { from: { pathname: getDefaultPathName() } };

  // if (authenticated) return <Navigate to={from} />; // todo
  const keys = Object.keys(calculationList);
  console.log(keys);
  return (
    <Wrapper>
      <HeaderContainer>
        <HeaderText>
          잇다가 알아서 잘 계산해 드립니다.
        </HeaderText>
      </HeaderContainer>
      <SectionContainer>
        <IconCardsContainer>
          <StyledIconCardContainer to="/hourly/calc/new">
            <StyledIconCard src={hourly} label="시급계산기" />
          </StyledIconCardContainer>
          <StyledIconCardContainer to="/annual/calc/new">
            <StyledIconCard src={yearly} label="연봉계산기" />
          </StyledIconCardContainer>
          <StyledIconCardContainer to="/leave/calc/new">
            <StyledIconCard src={calendar} label="연차계산기" />
          </StyledIconCardContainer>
          <StyledIconCardContainer to="/severance/calc/new">
            <StyledIconCard src={calc} label="퇴직금계산기" />
          </StyledIconCardContainer>
        </IconCardsContainer>
      </SectionContainer>

      <HistorySection>
        <Heading level={3} palette="black">
          최근 계산 내역
        </Heading>
        <HistoryCardSection>
          {keys.map((k) => {
            const currentCalculation = hourlyCalc(calculationList[k]);
            const { result } = currentCalculation;
            console.log(result);
            console.log(currentCalculation);
            return (
              <StyledCalcSummHeader
                key={k}
                summarised
                white
                title={result.name}
                hourly={result.hourlyWage}
                type={result.conversionType}
                beforeTax={result.totalWage}
                afterTax={result.netWage}
                category={result.conversionType}
                updatedAt={result.updatedAt}
                // beforeTax: 321000,
                // afterTax: 321000,
                // date: moment().toISOString(),
              />
            );
          })}
        </HistoryCardSection>
      </HistorySection>

    </Wrapper>
  );
};

Home.propTypes = { };

const mapStateToProps = (state, ownProps) => ({ calculationList: get(state, 'calculation.list', []) });
// const mapDispatchToProps = (dispatch) => ({ setListAction: (v) => dispatch(v) });
export default connect(mapStateToProps)(Home);
