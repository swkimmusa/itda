import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';
import _ from 'lodash';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import Card from '../../atoms/Card';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

import BaseInput, { styles as inputStyles } from '../Input/BaseInput';

const Container = styled(Flex)`
  flex-direction: column;
`;
const HeaderContainer = styled(Flex)`
  flex-wrap: wrap;
  align-items: center;
  `;

const HeaderText = styled(Text)`
  font-size: 18px;
  color: ${palette('black', 0)};
  font-weight: 500;
`;
const RowContainer = styled(Flex)`
  margin-top: 10px;
`;

const DayOfWeekLabel = styled(Text)`
  align-self: center;
  white-space: nowrap;
  color: ${palette('black', 0)};
`;

const StyledInput = styled(BaseInput)`
  flex-basis: 100px;
  margin-left: 16px;
  flex-grow: 1;
  text-align: end;
`;
const TimeMinutTextContainer = styled(Flex)`
  align-items: center;
  margin-left: 8px;
`;
const TimeMinueText = styled(Text)`
  white-space: nowrap;
`;
const ListContainer = styled(Flex)`
  flex-direction: column;
`;

const mapIndex = (viewIndex, startDayIndex) => {
  const valueIndex = (viewIndex + startDayIndex) % 7;
  return valueIndex;
};

const dayOfWeekLabelList = _.times(7).map((v) => moment().day(0 + v).format('dddd'));

const getHoursFromMinutes = (v) => ((v - (v % 60)) / 60);

const WeeklyHours = ({
  startDayIndex, // 0 = 일요일
  onChange,
  value,
  ...props
}) => {
  const {
    list,
    baseDate,
  } = value;
  const formattedBaseDate = dayjs(baseDate)
    .startOf('month')
    .hour(9)
    .toISOString();
  const pickBaseDateMonth = (str) => {
    onChange({
      list,
      baseDate: dayjs(formattedBaseDate)
        .year(moment(str).year())
        .month(moment(str).month())
        .toISOString(),
    });
  };
  return (
    <Container
      white
      {...props}
    >
      <HeaderContainer>
        <DatePicker
          style={{ fontSize: 18 }}
          onChange={(date, str) => pickBaseDateMonth(str)}
          size="large"
          picker="month"
          value={dayjs(formattedBaseDate)}
        />
        <HeaderText style={{ marginLeft: 8 }}>의 근무시간을 입력해 주세요.</HeaderText>
      </HeaderContainer>
      <ListContainer>
        {dayOfWeekLabelList.map((v, i) => {
          const valueIndex = mapIndex(i, startDayIndex);
          const rowLabel = dayOfWeekLabelList[valueIndex];
          const currentDay = moment(formattedBaseDate);
          const currentValue = list[valueIndex] || [
            formattedBaseDate,
            formattedBaseDate,
          ];
          const diffMinutes = moment(currentValue[1]).diff(moment(moment(currentValue[0])), 'minutes');
          return (
            <RowContainer
              key={rowLabel}
            >
              <DayOfWeekLabel>{rowLabel}</DayOfWeekLabel>
              <StyledInput
                value={getHoursFromMinutes(diffMinutes)}
                type="number"
                onChange={(hour) => {
                  const newList = list.slice();
                  const inputValue = Number(hour.target.value);
                  const limitedInputValue = inputValue > 23 ? 23 : (inputValue < 0 ? 0 : inputValue);
                  const prevHours = getHoursFromMinutes(diffMinutes);
                  const newMinutes = diffMinutes - (prevHours * 60) + (limitedInputValue * 60);
                  const newValue = [
                    moment(formattedBaseDate).day(valueIndex).toISOString(),
                    moment(formattedBaseDate).day(valueIndex).add(newMinutes, 'minutes').toISOString(),
                  ];
                  newList[valueIndex] = newValue;
                  onChange({
                    baseDate: formattedBaseDate,
                    list: newList,
                  });
                }}
              />
              <TimeMinutTextContainer>
                <TimeMinueText>
                  시간
                </TimeMinueText>
              </TimeMinutTextContainer>

              <StyledInput
                value={diffMinutes % 60}
                type="number"
                max={60}
                onChange={(minute) => {
                  const newList = list.slice();
                  const inputValue = Number(minute.target.value);
                  const limitedInputValue = inputValue > 59 ? 59 : (inputValue < 0 ? 0 : inputValue);
                  const prevMinutes = diffMinutes % 60;
                  const newMinutes = diffMinutes - prevMinutes + limitedInputValue;
                  const newValue = [
                    moment(formattedBaseDate).day(valueIndex).toISOString(),
                    moment(formattedBaseDate).day(valueIndex).add(newMinutes, 'minutes').toISOString(),
                  ];
                  newList[valueIndex] = newValue;
                  onChange({
                    baseDate: formattedBaseDate,
                    list: newList,
                  });
                }}
              />
              <TimeMinutTextContainer>
                <TimeMinueText>
                  분
                </TimeMinueText>
              </TimeMinutTextContainer>

            </RowContainer>
          );
        })}
      </ListContainer>

    </Container>
  );
};

WeeklyHours.propTypes = {
  startDayIndex: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.shape({
    baseDate: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.number),
  }),
};

WeeklyHours.defaultProps = {
  startDayIndex: 0, // sunday
  onChange: (v) => console.log('[WeeklyHours] onChange() ', v),
  value: {
    list: [],
    baseDate: moment().toISOString(),
  },
};

export default WeeklyHours;
