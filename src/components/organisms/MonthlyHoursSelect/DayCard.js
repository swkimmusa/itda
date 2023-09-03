import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';
import {
  ifProp, switchProp, prop,
} from 'styled-tools';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Card from '../../atoms/Card';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

import { rowCardStyles } from './styles';

const StyledCard = styled(Card)`
  padding: 12px;
  flex-direction: column;
  align-items: center;
  ${rowCardStyles};
`;

const DateText = styled(Text)`
  margin-bottom: auto;
`;
const HoursText = styled(Text)`
  font-weight: bold;
  margin-top: 6px;
`;
const HolidayText = styled(Text)`
  color: ${palette('red', 0)};
  font-weight: bold;
`;

const StyledText = styled(Text)`
  border-radius: 12px;
  font-size: 14px;
  background-color: ${palette('black', 0)};
  font-weight: 700; // bold
  padding: 5px 12px;
  color: ${switchProp('color', { green: palette('green', 0) })};
  align-self: flex-start;
  align-items: center;
`;

const DayCard = ({
  date,
  minutesWorked,
  isHoliday,
  ...props
}) => {
  return (
    <StyledCard
      {...props}
    >
      <DateText>
        {moment(date).date()}
      </DateText>
      {isHoliday && !minutesWorked ? (
        <HolidayText>휴무</HolidayText>
      ) : (
        <>
          <HoursText>
            {minutesWorked / 60 || '-'}
          </HoursText>
          <Text>
            시간
          </Text>
        </>
      )}
    </StyledCard>
  );
};

DayCard.propTypes = {};

DayCard.defaultProps = { color: 'green' };

export default DayCard;
