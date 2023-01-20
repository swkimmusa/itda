import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';

import Card from '../../atoms/Card';
import P from '../../atoms/P';
import Flex from '../../atoms/Flex';

const TitleRow = styled(Flex)`
  justify-content: space-between;
`;
const Title = styled(P)`
  font-size: 20px;
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
const CalcSummHeader = ({
  title,
  hourly,
  type,
  beforeTax,
  afterTax,
  date,
  ...props
}) => {
  return (
    <Card
      {...props}
    >
      <TitleRow>
        <Title>
          {title}
        </Title>
        <DateP>
          {moment(date).format('YYYY.MM.DD')}
        </DateP>
      </TitleRow>
      <TypeRow>
        <KeyP>시급</KeyP>
        <ValP>{hourly}</ValP>
      </TypeRow>
      <TypeRow>
        <KeyP>세전</KeyP>
        <ValP>{beforeTax}</ValP>
        <KeyP style={{ marginLeft: 32 }}>세후</KeyP>
        <ValP>{beforeTax}</ValP>
      </TypeRow>
    </Card>
  );
};

CalcSummHeader.propTypes = {
  title: PropTypes.string,
  hourly: PropTypes.number,
  type: PropTypes.string,
  beforeTax: PropTypes.number,
  afterTax: PropTypes.number,
  date: PropTypes.string, // ISO string
};

CalcSummHeader.defaultProps = {
  title: 'title',
  hourly: 10000,
  type: 'monthly',
  beforeTax: 321000,
  afterTax: 321000,
  date: moment().toISOString(),
};

export default CalcSummHeader;
