import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';
import { format } from 'number-currency-format';
import {
  formatNumber, formatCurrency,
} from '../../../services/formatCurrency';
import Card from '../../atoms/Card';
import P from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import TypeLabel from '../TypeLabel';

const StyledCard = styled(Card)`
  padding: 20px;
`;
const TitleRow = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
`;
const Title = styled(P)`
  font-size: 18px;
  font-weight: 600;
`;
const DateP = styled(P)`
  font-size: 14px;
  font-weight: 400;
`;
const TypeRow = styled(Flex)`
  margin-top: 20px;
`;
const KeyP = styled(P)`
  font-size: 16px;
  margin-right: 10px;
  white-space: nowrap;
`;
const ValP = styled(P)`
  font-size: 16px;
  color: ${palette('black', 0)};
  margin-right: 10px;
  white-space: nowrap;
`;
const SummHeaderContainer = styled(Flex)`
  margin-bottom: 15px;
  flex-direction: row;
  justify-content: space-between;
`;
const CalcSummHeader = ({
  title,
  hourly,
  type,
  beforeTax,
  afterTax,
  date,
  summarised,
  category,
  white,
  updatedAt,
  onDelete,
  ...props
}) => {
  return (
    <StyledCard
      {...props}
      white={white}
    >
      {summarised ? (
        <SummHeaderContainer>
          <TypeLabel>{category}</TypeLabel>
          <P>{moment(updatedAt).format('YYYY.MM.DD')}</P>
        </SummHeaderContainer>
      ) : null}
      <TitleRow>
        <Title>
          {title}
        </Title>
        {!white ? (
          <Icon icon="delete" onClick={onDelete} height={24} />
        ) : null}

      </TitleRow>
      <TypeRow>
        <KeyP>시급</KeyP>
        <ValP>{formatCurrency(hourly)}</ValP>
        <ValP>> {type}</ValP>
      </TypeRow>
      <TypeRow>
        <KeyP>세전</KeyP>
        <ValP>
          {formatCurrency(beforeTax)}
        </ValP>
        <KeyP style={{ marginLeft: 32 }}>세후</KeyP>
        <ValP>
          {formatCurrency(afterTax)}
        </ValP>
      </TypeRow>
    </StyledCard>
  );
};

CalcSummHeader.propTypes = {
  title: PropTypes.string,
  hourly: PropTypes.number,
  type: PropTypes.string,
  beforeTax: PropTypes.number,
  afterTax: PropTypes.number,
  date: PropTypes.string, // ISO string
  summarised: PropTypes.bool,
  category: PropTypes.string,
};

CalcSummHeader.defaultProps = {
  title: 'title',
  hourly: 10000,
  type: 'monthly',
  beforeTax: 321000,
  afterTax: 321000,
  date: moment().toISOString(),
  summarised: false,
  category: 'cat',
};

export default CalcSummHeader;
